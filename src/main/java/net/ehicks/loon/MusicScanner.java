package net.ehicks.loon;

import net.ehicks.eoi.EOI;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.TagField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

public class MusicScanner
{
    private static final Logger log = LoggerFactory.getLogger(Controller.class);
    private static final List<String> RECOGNIZED_EXTENSIONS = Arrays.asList("mp3", "flac", "wav", "m4a");

    public static void scan()
    {
        log.info("Deleted {} tracks", Track.deleteAll());
        
        try
        {
            AtomicInteger index = new AtomicInteger();
            Path basePath = Paths.get(LoonSystem.getSystem().getMusicFolder());
            Files.walk(basePath, FileVisitOption.FOLLOW_LINKS)
                    .filter(MusicScanner::isRecognizedExtension)
                    .forEach(path -> parseFile(path, index));
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

    private static void parseFile(Path path, AtomicInteger index)
    {
        AudioFile audioFile;
        try
        {
            log.info("Scanning file #" + index.getAndIncrement() + "  " + path.getFileName());
            audioFile = AudioFileIO.read(path.toFile());
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
            return;
        }

        AudioHeader audioHeader = audioFile.getAudioHeader();
        Tag tag = audioFile.getTag();

        Track track = new Track();
        track.setPath(path.toString());
        track.setDuration((long) audioHeader.getTrackLength());
        track.setSize(path.toFile().length());

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

        try
        {
            EOI.insert(track, SystemTask.STARTUP);
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
