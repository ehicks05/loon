package net.ehicks.loon;

import net.coobird.thumbnailator.Thumbnails;
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
import org.jaudiotagger.tag.images.Artwork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static net.ehicks.loon.CommonUtil.escapeForFileSystem;

@Configuration
public class MusicScanner
{
    private static final Logger log = LoggerFactory.getLogger(MusicScanner.class);
    private static final String PROGRESS_KEY = "musicFileScan";
    private static boolean RUNNING = false;

    private LoonSystemRepository loonSystemRepo;
    private TrackRepository trackRepo;
    private FileWalker fileWalker;

    public MusicScanner(LoonSystemRepository loonSystemRepo, TrackRepository trackRepo, FileWalker fileWalker)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.trackRepo = trackRepo;
        this.fileWalker = fileWalker;
    }

    public boolean isRunning()
    {
        return RUNNING;
    }

    /**
     * After running, the library should be completely synchronized with the filesystem.
     * */
    public void scan()
    {
        if (RUNNING)
            return;

        long start = System.currentTimeMillis();
        java.util.logging.Logger.getLogger("org.jaudiotagger").setLevel(Level.WARNING);

        try
        {
            RUNNING = true;

            ProgressTracker.progressStatusMap.put(PROGRESS_KEY, new ProgressTracker.ProgressStatus(0, "incomplete"));

            AtomicInteger filesProcessed = new AtomicInteger();
            LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
            if (loonSystem == null)
                return;

            Path artPath = Paths.get(loonSystem.getDataFolder(), "art").toAbsolutePath();

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
                ProgressTracker.progressStatusMap.get(PROGRESS_KEY).setProgress(progress);

                AudioFile audioFile = getAudioFile(path);
                if (audioFile == null)
                    return;

                Track track = parseAudioFile(audioFile, artPath);
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
            List<Track> tracksWithMissingFile = tracksInDb;
            tracksWithMissingFile.forEach(track -> track.setMissingFile(true));
            trackRepo.saveAll(tracksWithMissingFile);

            log.info("Scan complete: Added " + tracksToSave.size() + " tracks.");
            long dur = System.currentTimeMillis() - start;
            double durSeconds = ((double) dur) / 1000;
            log.info("Files considered: " + paths.size() + ". " + dur + "ms (" + Math.round(paths.size() / durSeconds) + " files / sec)");
            log.info("Tracks saved: " + tracksToSave.size() + ". " + dur + "ms (" + Math.round(tracksToSave.size() / durSeconds) + " tracks / sec)");
            log.info("Tracks missing file: " + tracksWithMissingFile.size() + ". " + dur + "ms (" + Math.round(tracksWithMissingFile.size() / durSeconds) + " tracks / sec)");
            ProgressTracker.progressStatusMap.put(PROGRESS_KEY, new ProgressTracker.ProgressStatus(100, "complete"));
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
        finally
        {
            RUNNING = false;
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

    private Track parseAudioFile(AudioFile audioFile, Path artPath)
    {
        AudioHeader audioHeader = audioFile.getAudioHeader();
        Tag tag = audioFile.getTag();

        Track track = new Track();
        track.setPath(audioFile.getFile().toPath().toString());
        track.setExtension(audioFile.getExt());
        track.setDuration((long) audioHeader.getTrackLength());
        track.setSize(audioFile.getFile().length());

        audioHeader.getSampleRateAsNumber();

        track.setArtist(tag.getFirst(FieldKey.ARTIST));
        track.setTitle(tag.getFirst(FieldKey.TITLE));
        track.setAlbum(tag.getFirst(FieldKey.ALBUM));
        track.setAlbumArtist(tag.getFirst(FieldKey.ALBUM_ARTIST));
        track.setTrackPeak(tag.getFirst("REPLAYGAIN_TRACK_PEAK"));
        track.setTrackGain(tag.getFirst("REPLAYGAIN_TRACK_GAIN"));

        if (track.getTrackGain().isEmpty())
        {
            String rpGain = deepScanForReplayGain(tag);
            track.setTrackGain(rpGain);
        }

        track.setTrackGain(track.getTrackGain().replace(" dB", ""));
        track.setTrackGainLinear(track.convertDBToLinear());

        if (tag.getArtworkList().size() > 0)
        {
            saveArtwork(tag, track, artPath);
        }

        String trackNumString = tag.getFirst(FieldKey.TRACK);
        trackNumString = trackNumString.contains("/") ? trackNumString.substring(0, trackNumString.indexOf("/")) : trackNumString;
        int trackNumber = trackNumString.isEmpty() ? 1 : Integer.valueOf(trackNumString);
        track.setTrackNumber(trackNumber);
        int discNumber = !tag.getFirst(FieldKey.DISC_NO).isEmpty() ? Integer.valueOf(tag.getFirst(FieldKey.DISC_NO)) : 1;
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
        {
            String albumArtist = tag.getFirst(FieldKey.ALBUM_ARTIST);
            String artists = tag.getFirst(FieldKey.ARTISTS);

            String newArtist = "";
            if (!albumArtist.isBlank() && !albumArtist.contains(" feat. "))
                newArtist = albumArtist;
            if (newArtist.isBlank() && !artists.isBlank() && !artists.contains(" feat. "))
                newArtist = artists;
            
            log.info("Replacing " + track.getArtist() + " ...with... " + newArtist);
            track.setArtist(newArtist);
        }

        String id = track.getMusicBrainzTrackId().isBlank() ? track.getArtist() + " - " + track.getAlbum() + " - " + track.getTitle() : track.getMusicBrainzTrackId();
        track.setId(id);
        return track;
    }

    private void saveArtwork(Tag tag, Track track, Path artPath)
    {
        Artwork artwork = tag.getFirstArtwork();
        if (artwork == null)
            return;

        String ext = "." + artwork.getMimeType().replace("image/", "");

        String escapedAlbumArtist = escapeForFileSystem(track.getAlbumArtist());
        String escapedAlbum = escapeForFileSystem(track.getAlbum());
        String imageFileName = escapeForFileSystem(track.getAlbum()) + ext;

        // look for a 'folder.jpg' in the track's directory
        Path trackPath = Paths.get(track.getPath());
        Path trackFolderPath = trackPath.getRoot().resolve(trackPath.subpath(0, trackPath.getNameCount() - 1));
        if (trackFolderPath.toFile().exists() && trackFolderPath.toFile().isDirectory())
        {
            File[] files = trackFolderPath.toFile().listFiles();
            for (File file : files)
            {
                if (file.isFile() && file.getName().toLowerCase().startsWith("folder"))
                {
                    try (InputStream in = new BufferedInputStream(new FileInputStream(file)))
                    {
                        Path base = Paths.get(artPath.toFile().getCanonicalPath(), escapedAlbumArtist, escapedAlbum);
                        Files.createDirectories(base);
                        Path out = base.resolve(file.getName());

                        if (!out.toFile().exists())
                            Files.copy(in, out);

                        track.setAlbumImageId(escapedAlbumArtist + "/" + escapedAlbum + "/" + file.getName());
                        return;
                    }
                    catch (Exception e)
                    {
                        log.error(e.getMessage(), e);
                    }
                }
            }
        }

        try
        {
            File artFile = Paths.get(artPath.toFile().getCanonicalPath(), escapedAlbumArtist, escapedAlbum, imageFileName).toFile();
            if (artFile.exists())
            {
                track.setAlbumImageId(escapedAlbumArtist + "/" + escapedAlbum + "/" + imageFileName);
                return;
            }
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
            return;
        }

        byte[] imageData = artwork.getBinaryData();
        byte[] resizedImageData;

        try
        {
            resizedImageData = resize(new ByteArrayInputStream(imageData), artwork.getMimeType(), 300, 300);
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
            return;
        }

        if (resizedImageData == null)
            return;

        try (InputStream in = new ByteArrayInputStream(resizedImageData))
        {
            Path base = Paths.get(artPath.toFile().getCanonicalPath(), escapedAlbumArtist, escapedAlbum);
            Files.createDirectories(base);
            Path out = base.resolve(imageFileName);

            if (!out.toFile().exists())
                Files.copy(in, out);

            track.setAlbumImageId(escapedAlbumArtist + "/" + escapedAlbum + "/" + imageFileName);
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
        return "0";
    }

    private byte[] resize(InputStream inputStream, String contentType, int targetWidth, int targetHeight) throws IOException
    {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        Thumbnails.of(inputStream).size(targetWidth, targetHeight).toOutputStream(os);
        return os.toByteArray();
    }
}
