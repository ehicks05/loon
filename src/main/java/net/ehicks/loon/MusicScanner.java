package net.ehicks.loon;

import net.ehicks.loon.beans.DBFile;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.DbFileRepository;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.imgscalr.Scalr;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.TagField;
import org.jaudiotagger.tag.images.Artwork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.FileVisitOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Configuration
public class MusicScanner
{
    private static final Logger log = LoggerFactory.getLogger(MusicScanner.class);
    private static final List<String> RECOGNIZED_EXTENSIONS = Arrays.asList("mp3", "flac", "wav", "m4a");

    private LoonSystemRepository loonSystemRepo;
    private DbFileRepository dbFileRepo;
    private TrackRepository trackRepo;

    public MusicScanner(LoonSystemRepository loonSystemRepo, DbFileRepository dbFileRepo, TrackRepository trackRepo)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.dbFileRepo = dbFileRepo;
        this.trackRepo = trackRepo;
    }

    public void scan()
    {
        log.info("Deleting {} tracks", trackRepo.count());
        trackRepo.deleteAll();
        log.info("Done deleting");

        try
        {
            ProgressTracker.progressStatusMap.put("scanProgress", new ProgressTracker.ProgressStatus(0, "incomplete"));

            AtomicInteger index = new AtomicInteger();
            Path basePath = Paths.get(loonSystemRepo.findById(1L).get().getMusicFolder());

            List<AudioFile> audioFilesToImport = Files.walk(basePath, FileVisitOption.FOLLOW_LINKS)
                    .filter(this::isRecognizedExtension)
                    .map(this::getAudioFile).collect(Collectors.toList());

            audioFilesToImport.forEach(audioFile -> {
                parseAudioFile(audioFile, index);
                ProgressTracker.progressStatusMap.get("scanProgress").setProgress((int) Math.floor((double) (index.get() * 100)) / audioFilesToImport.size());
            });

            log.info("Scan complete");
            ProgressTracker.progressStatusMap.put("scanProgress", new ProgressTracker.ProgressStatus(100, "complete"));
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }

    private boolean isRecognizedExtension(Path path)
    {
        String filename = path.getFileName().toString();
        String extension = filename.substring(filename.lastIndexOf(".") + 1);
        return (RECOGNIZED_EXTENSIONS.contains(extension.toLowerCase()));
    }

    private AudioFile getAudioFile(Path path)
    {
        if (trackRepo.findByPath(path.toString()) != null)
            return null;

        AudioFile audioFile;
        try
        {
            log.info(path.toFile().getName());
            audioFile = AudioFileIO.read(path.toFile());
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
            return null;
        }

        return audioFile;
    }

    private void parseAudioFile(AudioFile audioFile, AtomicInteger index)
    {
        AudioHeader audioHeader = audioFile.getAudioHeader();
        Tag tag = audioFile.getTag();

        Track track = new Track();
        track.setPath(audioFile.getFile().toPath().toString());
        track.setDuration((long) audioHeader.getTrackLength());
        track.setSize(audioFile.getFile().length());

        audioHeader.getSampleRateAsNumber();

        track.setArtist(tag.getFirst(FieldKey.ARTIST));
        track.setTitle(tag.getFirst(FieldKey.TITLE));
        track.setAlbum(tag.getFirst(FieldKey.ALBUM));
        track.setTrackGain(tag.getFirst("REPLAYGAIN_TRACK_GAIN"));
        track.setTrackPeak(tag.getFirst("REPLAYGAIN_TRACK_PEAK"));

        if (track.getTrackGain().isEmpty())
        {
            String rpgain = deepScanForReplayGain(tag);
            track.setTrackGain(rpgain + " dB");
        }

        track.setTrackGainLinear(track.convertDBToLinear());

        if (tag.getArtworkList().size() > 0)
        {
            Artwork artwork = tag.getArtworkList().get(0);
            DBFile artworkFile = new DBFile(track.getTitle(), artwork.getBinaryData());
            artworkFile = dbFileRepo.save(artworkFile);
            track.setArtworkDbFileId(artworkFile.getId());
            try
            {
                byte[] thumbnailData = getThumbnail(new ByteArrayInputStream(artwork.getBinaryData()), artwork.getMimeType());
                DBFile thumbnail = new DBFile(track.getTitle(), thumbnailData);
                thumbnail = dbFileRepo.save(thumbnail);

                artworkFile.setThumbnailId(thumbnail.getId());
                artworkFile = dbFileRepo.save(artworkFile);
            }
            catch (Exception e)
            {
                log.error(e.getMessage(), e);
            }
        }

        try
        {
            trackRepo.save(track);
            index.getAndIncrement();
            if (index.get() % 1000 == 0)
                log.info("Added file #" + index.get());
        }
        catch (Exception e)
        {
            log.error("Unable to add " + track.getArtist() + " - " + track.getTitle());
        }

        tag.getFirst("REPLAYGAIN_TRACK_GAIN");
        tag.getFirst("REPLAYGAIN_TRACK_PEAK");
        tag.getFirst(FieldKey.COMMENT);
        tag.getFirst(FieldKey.YEAR);
        tag.getFirst(FieldKey.TRACK);
        tag.getFirst(FieldKey.DISC_NO);
        tag.getFirst(FieldKey.COMPOSER);
        tag.getFirst(FieldKey.ARTIST_SORT);
    }

    private String deepScanForReplayGain(Tag tag)
    {
        final Pattern getGain = Pattern.compile("-?[.\\d]+");
        Iterator<TagField> fields = tag.getFields();
        while(fields.hasNext())
        {
            TagField field = fields.next();
            if((field.getId() + field.toString().toLowerCase()).contains("replaygain_track_gain"))
            {
                Matcher m = getGain.matcher(field.toString());
                m.find();
                return m.group();
            }
        }
        return "";
    }

    private byte[] getThumbnail(InputStream inputStream, String contentType) throws IOException
    {
        BufferedImage srcImage = ImageIO.read(inputStream); // Load image
        Scalr.Mode mode = srcImage.getWidth() > srcImage.getHeight() ? Scalr.Mode.FIT_TO_WIDTH : Scalr.Mode.FIT_TO_HEIGHT;
        BufferedImage scaledImage = Scalr.resize(srcImage, mode, 128, 128); // Scale image
        String formatName = contentType.replace("image/", "");
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(scaledImage, formatName, byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();
    }
}
