package net.ehicks.loon.tasks;

import net.ehicks.loon.FileWalker;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.TagField;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import javax.xml.bind.DatatypeConverter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Configuration
public class MusicScanner extends Task
{
    private static final Logger log = LoggerFactory.getLogger(MusicScanner.class);
    public String id = "MusicScanner";

    public String getId()
    {
        return id;
    }

    private LoonSystemRepository loonSystemRepo;
    private TrackRepository trackRepo;
    private FileWalker fileWalker;
    private TaskWatcher taskWatcher;

    public MusicScanner(LoonSystemRepository loonSystemRepo, TrackRepository trackRepo, FileWalker fileWalker, TaskWatcher taskWatcher)
    {
        super(taskWatcher);
        this.loonSystemRepo = loonSystemRepo;
        this.trackRepo = trackRepo;
        this.fileWalker = fileWalker;
        this.taskWatcher = taskWatcher;

        taskWatcher.initTask(id);
    }

    /**
     * After running, the library should be completely synchronized with the filesystem:
     * New files should be added as tracks.
     * Changes to file metadata should be reflected in the tracks.
     * Files removed from the filesystem should be identified.
     * New or changed artwork should be copied to the static assets folder and linked to the tracks.
     * Deleted artwork should have no effect on the copies in the static assets folder.
     * */
    public void performTask(Map<String, Object> options)
    {
        java.util.logging.Logger.getLogger("org.jaudiotagger").setLevel(Level.WARNING);

        try
        {
            AtomicInteger filesProcessed = new AtomicInteger();
            LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
            if (loonSystem == null)
                return;

            Path basePath = Paths.get(loonSystem.getMusicFolder());
            if (!basePath.toFile().exists())
            {
                log.info("basePath doesn't exist.");
                return;
            }

            fileWalker.setPaths(new ArrayList<>());
            Files.walkFileTree(basePath, fileWalker);
            List<Path> paths = fileWalker.getPaths();

            List<Track> tracksOnDisk = new ArrayList<>();
            List<Track> tracksToSave = new ArrayList<>();
            Set<String> trackIds = new HashSet<>();

            paths.forEach(path -> {
                int progress = (int) ((filesProcessed.incrementAndGet() * 100) / (double) paths.size());
                taskWatcher.update(id, progress);

                AudioFile audioFile = getAudioFile(path);
                if (audioFile == null)
                    return;

                Track track = parseAudioFile(audioFile);
                if (trackIds.contains(track.getId()))
                {
                    Track alreadyFound = tracksOnDisk.stream().filter(track1 -> track1.getId().equals(track.getId())).findFirst().orElse(null);
                    log.warn("Detected duplicate track: " + track.getPath() + " and " + alreadyFound.getPath());
                    return;
                }

                trackIds.add(track.getId());
                tracksOnDisk.add(track);
            });

            List<Track> tracksInDb = trackRepo.findAll();
            tracksOnDisk.forEach(trackFromDisk -> {
                Track trackFromDb = tracksInDb.stream().filter(track1 -> track1.getId().equals(trackFromDisk.getId())).findFirst().orElse(null);

                if (trackFromDb != null)
                    tracksInDb.remove(trackFromDb);

                if (!trackFromDisk.equals(trackFromDb))
                    tracksToSave.add(trackFromDisk);
            });

            trackRepo.saveAll(tracksToSave);

            // at this point tracksInDb will only contain tracks that were not found in the filesystem.
            List<Track> tracksWithoutAFile = tracksInDb;
            tracksWithoutAFile.forEach(track -> track.setMissingFile(true));
            trackRepo.saveAll(tracksWithoutAFile);

            log.info("Scan complete: Added " + tracksToSave.size() + " tracks.");
            long dur = System.currentTimeMillis() - (long) options.get("startTime");
            double durSeconds = ((double) dur) / 1000;
            log.info("Duration: " + dur + "ms");
            log.info("Files considered: " + paths.size() + ". " + "(" + Math.round(paths.size() / durSeconds) + " files / sec)");
            log.info("Tracks saved: " + tracksToSave.size());
            log.info("Tracks missing file: " + tracksWithoutAFile.size());
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }

    private AudioFile getAudioFile(Path path)
    {
        AudioFile audioFile;
        try
        {
            log.debug(path.toFile().getName());
            audioFile = AudioFileIO.read(path.toFile());
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
            return null;
        }

        return audioFile;
    }

    private Track parseAudioFile(AudioFile audioFile)
    {
        Track track = new Track();

        AudioHeader audioHeader = audioFile.getAudioHeader();
        track.setDuration((long) audioHeader.getTrackLength());
        track.setSampleRate(audioHeader.getSampleRateAsNumber());
        track.setBitDepth(audioHeader.getBitsPerSample());

        Tag tag = audioFile.getTag();
        track.setPath(audioFile.getFile().toPath().toString());
        track.setExtension(audioFile.getExt());
        track.setSize(audioFile.getFile().length());
        track.setArtist(tag.getFirst(FieldKey.ARTIST));
        track.setTitle(tag.getFirst(FieldKey.TITLE));
        track.setAlbum(tag.getFirst(FieldKey.ALBUM));
        track.setAlbumArtist(tag.getFirst(FieldKey.ALBUM_ARTIST));
        track.setTrackPeak(tag.getFirst("REPLAYGAIN_TRACK_PEAK"));
        track.setTrackGain(tag.getFirst("REPLAYGAIN_TRACK_GAIN"));

        if (track.getTrackPeak().isEmpty())
        {
            String rpPeak = deepScanForTagField(tag, "replaygain_track_peak", "");
            track.setTrackPeak(rpPeak);
        }
        if (track.getTrackGain().isEmpty())
        {
            String rpGain = deepScanForTagField(tag, "replaygain_track_gain", "0");
            track.setTrackGain(rpGain);
        }

        track.setTrackGain(track.getTrackGain().replace(" dB", ""));
        track.setTrackGainLinear(track.convertDBToLinear());

        String trackNumString = tag.getFirst(FieldKey.TRACK);
        trackNumString = trackNumString.contains("/") ? trackNumString.substring(0, trackNumString.indexOf("/")) : trackNumString;
        int trackNumber = trackNumString.isEmpty() ? 1 : Integer.parseInt(trackNumString);
        track.setTrackNumber(trackNumber);
        int discNumber = !tag.getFirst(FieldKey.DISC_NO).isEmpty() ? Integer.parseInt(tag.getFirst(FieldKey.DISC_NO)) : 1;
        track.setDiscNumber(discNumber);

        track.setMusicBrainzTrackId(tag.getFirst(FieldKey.MUSICBRAINZ_TRACK_ID));
        if (track.getMusicBrainzTrackId().isEmpty())
        {
            track.setMusicBrainzTrackId(tag.getFirst(FieldKey.MUSICBRAINZ_RELEASE_TRACK_ID));
            if (track.getMusicBrainzTrackId().isEmpty())
                log.warn(track.getArtist() + " - " + track.getTitle() + ": no musicBrainzTrackId");
        }

        // condense artists like 'Foo feat. Bar' down to hopefully just 'Foo'
        if (track.getArtist().contains(" feat. "))
            removeFeaturedArtist(tag, track);

        String id = "";
        if (track.getMusicBrainzTrackId().isBlank())
        {
            try
            {
                MessageDigest md = MessageDigest.getInstance("MD5");
                String hashInput = track.getArtist() + ":" + track.getAlbum() + ":" + track.getTitle();
                md.update(hashInput.getBytes());
                id = DatatypeConverter.printHexBinary(md.digest()).toUpperCase();
            }
            catch (Exception e)
            {
                log.error(e.getMessage(), e);
            }
        }
        else
            id = track.getMusicBrainzTrackId();

        track.setId(id);
        return track;
    }

    private void removeFeaturedArtist(Tag tag, Track track) {
        String albumArtist = tag.getFirst(FieldKey.ALBUM_ARTIST);
        String artists = tag.getFirst(FieldKey.ARTISTS);

        String newArtist = "";
        if (!albumArtist.isBlank() && !albumArtist.contains(" feat. "))
            newArtist = albumArtist;
        if (newArtist.isBlank() && !artists.isBlank() && !artists.contains(" feat. "))
            newArtist = artists;

        log.debug("Replacing " + track.getArtist() + " ...with... " + newArtist);
        track.setArtist(newArtist);
    }

    private String deepScanForTagField(Tag tag, String query, String defaultVal)
    {
        final Pattern pattern = Pattern.compile("-?[.\\d]+");
        Iterator<TagField> fields = tag.getFields();
        while(fields.hasNext())
        {
            TagField field = fields.next();
            if((field.getId() + field.toString().toLowerCase()).contains(query))
            {
                Matcher m = pattern.matcher(field.toString());
                m.find();
                return m.group();
            }
        }
        return defaultVal;
    }
}
