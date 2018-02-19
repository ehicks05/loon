package net.ehicks.loon;

import net.ehicks.eoi.EOI;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.FileVisitOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

public class MusicScanner
{
    private static final Logger log = LoggerFactory.getLogger(Controller.class);
    private static final List<String> RECOGNIZED_EXTENSIONS = Arrays.asList("mp3", "flac", "wav", "m4a");

    public static void scan()
    {
        log.info("Deleted {} tracks", Track.deleteAll());
        
        try
        {
            Path basePath = Paths.get(LoonSystem.getSystem().getMusicFolder());
            Files.walk(basePath, FileVisitOption.FOLLOW_LINKS)
                    .filter(MusicScanner::isRecognizedExtension)
                    .forEach(MusicScanner::parseFile);
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

    private static void parseFile(Path path)
    {
        AudioFile audioFile;
        try
        {
            log.info("Scanning " + path.getFileName());
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

        EOI.insert(track, SystemTask.STARTUP);

        tag.getFirst(FieldKey.ALBUM);
        tag.getFirst(FieldKey.COMMENT);
        tag.getFirst(FieldKey.YEAR);
        tag.getFirst(FieldKey.TRACK);
        tag.getFirst(FieldKey.DISC_NO);
        tag.getFirst(FieldKey.COMPOSER);
        tag.getFirst(FieldKey.ARTIST_SORT);
    }
}
