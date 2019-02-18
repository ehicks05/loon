package net.ehicks.loon;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
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
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static net.ehicks.loon.CommonUtil.escapeForFileSystem;

@Configuration
public class MusicScanner
{
    private static final Logger log = LoggerFactory.getLogger(MusicScanner.class);

    private LoonSystemRepository loonSystemRepo;
    private TrackRepository trackRepo;
    private FileWalker fileWalker;

    public MusicScanner(LoonSystemRepository loonSystemRepo, TrackRepository trackRepo, FileWalker fileWalker)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.trackRepo = trackRepo;
        this.fileWalker = fileWalker;
    }

    public void scan()
    {
        long start = System.currentTimeMillis();
        java.util.logging.Logger.getLogger("org.jaudiotagger").setLevel(Level.WARNING);

        try
        {
            ProgressTracker.progressStatusMap.put("scanProgress", new ProgressTracker.ProgressStatus(0, "incomplete"));

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

            List<Track> tracksToSave = new ArrayList<>();

            paths.forEach(path -> {
                if (trackRepo.findByPath(path.toString()) != null)
                    return;
                
                AudioFile audioFile = getAudioFile(path);
                if (audioFile == null)
                    return;

                Track track = parseAudioFile(audioFile, artPath);
                tracksToSave.add(track);

                int progress = (int) ((filesProcessed.incrementAndGet() * 100) / (double) paths.size());
                ProgressTracker.progressStatusMap.get("scanProgress").setProgress(progress);
            });

            trackRepo.saveAll(tracksToSave);

            log.info("Scan complete: Added " + tracksToSave.size() + " tracks.");
            long dur = System.currentTimeMillis() - start;
            log.info("Took " + dur + "ms (" + (tracksToSave.size() / (((double) dur) / 1000)) + " tracks / sec)");
            ProgressTracker.progressStatusMap.put("scanProgress", new ProgressTracker.ProgressStatus(100, "complete"));
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
            saveArtwork(tag, track, artPath);
        }

        int trackNumber = !tag.getFirst(FieldKey.TRACK).isEmpty() ? Integer.valueOf(tag.getFirst(FieldKey.TRACK)) : 1;
        track.setTrackNumber(trackNumber);
        int discNumber = !tag.getFirst(FieldKey.DISC_NO).isEmpty() ? Integer.valueOf(tag.getFirst(FieldKey.DISC_NO)) : 1;
        track.setDiscNumber(discNumber);

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
        return "";
    }

    private byte[] resize(InputStream inputStream, String contentType, int targetWidth, int targetHeight) throws IOException
    {
        BufferedImage srcImage = ImageIO.read(inputStream); // Load image
        Scalr.Mode mode = srcImage.getWidth() > srcImage.getHeight() ? Scalr.Mode.FIT_TO_WIDTH : Scalr.Mode.FIT_TO_HEIGHT;
        BufferedImage scaledImage = Scalr.resize(srcImage, mode, targetWidth, targetHeight); // Scale image
        String formatName = contentType.replace("image/", "");
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(scaledImage, formatName, byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();
    }
}
