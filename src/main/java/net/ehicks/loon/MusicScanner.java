package net.ehicks.loon;

import net.ehicks.loon.beans.DBFile;
import net.ehicks.loon.beans.LoonSystem;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
public class MusicScanner
{
    private static final Logger log = LoggerFactory.getLogger(MusicScanner.class);

    private LoonSystemRepository loonSystemRepo;
    private DbFileRepository dbFileRepo;
    private TrackRepository trackRepo;
    private FileWalker fileWalker;

    public MusicScanner(LoonSystemRepository loonSystemRepo, DbFileRepository dbFileRepo, TrackRepository trackRepo, FileWalker fileWalker)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.dbFileRepo = dbFileRepo;
        this.trackRepo = trackRepo;
        this.fileWalker = fileWalker;
    }

    public void scan()
    {
        if (trackRepo.count() > 0)
            return;

        try
        {
            ProgressTracker.progressStatusMap.put("scanProgress", new ProgressTracker.ProgressStatus(0, "incomplete"));

            AtomicInteger filesProcessed = new AtomicInteger();
            AtomicInteger tracksAdded = new AtomicInteger();
            LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
            if (loonSystem == null)
                return;

            Path basePath = Paths.get(loonSystem.getMusicFolder());
            if (!basePath.toFile().exists())
            {
                log.info("basePath doesn't exist.");
                return;
            }

            Files.walkFileTree(basePath, fileWalker);
            List<Path> paths = fileWalker.getPaths();

            paths.forEach(path -> {
                AudioFile audioFile = getAudioFile(path);
                if (audioFile == null)
                    return;

                parseAudioFile(audioFile, tracksAdded);
                int progress = (int) ((filesProcessed.incrementAndGet() * 100) / (double) paths.size());
                ProgressTracker.progressStatusMap.get("scanProgress").setProgress(progress);
            });

            log.info("Scan complete: Added " + tracksAdded + " tracks.");
            ProgressTracker.progressStatusMap.put("scanProgress", new ProgressTracker.ProgressStatus(100, "complete"));
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
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

    private void parseAudioFile(AudioFile audioFile, AtomicInteger tracksAdded)
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
//            saveArtwork(tag, track);

        try
        {
            trackRepo.save(track);
            tracksAdded.getAndIncrement();
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

    private void saveArtwork(Tag tag, Track track)
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
