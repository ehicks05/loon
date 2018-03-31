package net.ehicks.loon;

import net.ehicks.eoi.EOI;
import net.ehicks.loon.beans.DBFile;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.util.CommonIO;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.TagField;
import org.jaudiotagger.tag.images.Artwork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayInputStream;
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

public class MusicScanner
{
    private static final Logger log = LoggerFactory.getLogger(Controller.class);
    private static final List<String> RECOGNIZED_EXTENSIONS = Arrays.asList("mp3", "flac", "wav", "m4a");

    public static void scan()
    {
        log.info("Deleted {} tracks", Track.deleteAll());
        
        try
        {
            ProgressTracker.progressStatusMap.put("scanProgress", new ProgressStatus(0, "incomplete"));

            AtomicInteger index = new AtomicInteger();
            Path basePath = Paths.get(LoonSystem.getSystem().getMusicFolder());

            List<AudioFile> audioFilesToImport = Files.walk(basePath, FileVisitOption.FOLLOW_LINKS)
                    .filter(MusicScanner::isRecognizedExtension)
                    .map(MusicScanner::getAudioFile).collect(Collectors.toList());

            audioFilesToImport.forEach(audioFile -> {
                parseAudioFile(audioFile, index);
                ProgressTracker.progressStatusMap.get("scanProgress").setProgress((int) Math.floor((double) (index.get() * 100)) / audioFilesToImport.size());
            });

            log.info("Scan complete");
            ProgressTracker.progressStatusMap.put("scanProgress", new ProgressStatus(100, "complete"));
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }

    private static boolean isRecognizedExtension(Path path)
    {
        String filename = path.getFileName().toString();
        String extension = filename.substring(filename.lastIndexOf(".") + 1);
        return (RECOGNIZED_EXTENSIONS.contains(extension.toLowerCase()));
    }

    private static AudioFile getAudioFile(Path path)
    {
        if (Track.getByPath(path.toString()) != null)
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

    private static void parseAudioFile(AudioFile audioFile, AtomicInteger index)
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
            Long artworkFileId = EOI.insert(artworkFile, SystemTask.STARTUP);
            artworkFile.setId(artworkFileId);
            track.setArtworkDbFileId(artworkFileId);
            try
            {
                byte[] thumbnailData = CommonIO.getThumbnail(new ByteArrayInputStream(artwork.getBinaryData()), artwork.getMimeType());
                DBFile thumbnail = new DBFile(track.getTitle(), thumbnailData);
                Long thumbnailFileId = EOI.insert(thumbnail, SystemTask.STARTUP);

                artworkFile.setThumbnailId(thumbnailFileId);
                EOI.update(artworkFile, SystemTask.STARTUP);
            }
            catch (Exception e)
            {
                log.error(e.getMessage(), e);
            }
        }

        try
        {
            EOI.insert(track, SystemTask.STARTUP);
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

    private static String deepScanForReplayGain(Tag tag)
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
}
