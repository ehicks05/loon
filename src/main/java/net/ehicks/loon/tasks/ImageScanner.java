package net.ehicks.loon.tasks;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.TrackRepository;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.images.Artwork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static net.ehicks.loon.tasks.ImageUtil.getThumb;
import static net.ehicks.loon.tasks.ImageUtil.urlToBytes;

@Configuration
public class ImageScanner extends Task
{
    private static final Logger log = LoggerFactory.getLogger(ImageScanner.class);
    public String id = "ImageScanner";

    private final AtomicInteger imagesAdded = new AtomicInteger();

    public String getId()
    {
        return id;
    }

    private final TrackRepository trackRepo;
    private final TaskWatcher taskWatcher;
    private final Spotify spotify;
    private final CloudinaryService cloudinaryService;

    public ImageScanner(TrackRepository trackRepo, TaskWatcher taskWatcher, Spotify spotify, CloudinaryService cloudinaryService)
    {
        super(taskWatcher);
        this.trackRepo = trackRepo;
        this.taskWatcher = taskWatcher;
        this.spotify = spotify;
        this.cloudinaryService = cloudinaryService;

        taskWatcher.initTask(id);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    public void performTask(Map<String, Object> options)
    {
        imagesAdded.set(0);

        try
        {
            AtomicInteger tracksProcessed = new AtomicInteger();

            List<Track> tracks = trackRepo.findAll().stream()
                    .filter(track -> !track.getArtist().isEmpty() && !track.getAlbum().isEmpty())
                    .collect(Collectors.toList());

            for (Track track : tracks)
            {
                try
                {
                    processArtistImage(track);
                    processAlbumImage(track);
                }
                catch (Exception e)
                {
                    log.error(e.getMessage(), e);
                }

                int progress = (int) ((tracksProcessed.incrementAndGet() * 100) / (double) tracks.size());
                taskWatcher.update(id, progress);
            }

            double dur = System.currentTimeMillis() - (long) options.get("startTime");
            double seconds = dur / ((double) 1000);
            double ips = imagesAdded.doubleValue() / seconds;
            log.info("Scan complete: Added " + imagesAdded + " images. (" + ips + " images / sec)");
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }

    // artist image will be sourced from Spotify
    private void processArtistImage(Track track)
    {
        if (!track.getArtistImageId().isEmpty())
            return;

        String imageUrl = spotify.getImageUrl(track.getArtist(), null);
        byte[] bytes = urlToBytes(imageUrl);

        // make thumbnail
        byte[] thumbBytes = getThumb(bytes);

        // upload
        String outputName = getSafeName("art", track.getArtist(), track.getArtist());
        if (bytes != null) {
            String fileId = cloudinaryService.upload(bytes, outputName);
            track.setArtistImageId(fileId);
            imagesAdded.incrementAndGet();
        }
        if (thumbBytes != null) {
            outputName = outputName + "-thumb";
            String thumbFileId = cloudinaryService.upload(thumbBytes, outputName);
            track.setArtistThumbnailId(thumbFileId);
            imagesAdded.incrementAndGet();
        }
        if (bytes.length != 0 || thumbBytes != null)
            trackRepo.save(track);
    }

    // album image will be sourced in order of preference from:
    // 1. 'folder.jpg' in same folder as the track
    // 2. artwork embedded inside the track.
    // 3. spotify
    private void processAlbumImage(Track track) throws Exception
    {
        if (!track.getAlbumImageId().isEmpty())
            return;

        File adjacentArtworkFile = findAdjacentArtworkFile(track);
        File musicFile = Paths.get(track.getPath()).toFile();
        Artwork artwork = getArtwork(musicFile);

        byte[] bytes;
        // check adjacentArtworkFile
        if (adjacentArtworkFile != null)
            bytes = new FileInputStream(adjacentArtworkFile).readAllBytes();
        // check embedded artwork
        else if (artwork != null)
            bytes = artwork.getBinaryData();
        // check spotify
        else {
            String imageUrl = spotify.getImageUrl(track.getAlbumArtist(), track.getAlbum());
            bytes = urlToBytes(imageUrl);
        }

        // make thumbnail
        byte[] thumbBytes = getThumb(bytes);

        // upload
        String outputName = getSafeName("art", track.getAlbumArtist(), "albums", track.getAlbum());
        if (bytes != null) {
            String fileId = cloudinaryService.upload(bytes, outputName);
            track.setAlbumImageId(fileId);
            imagesAdded.incrementAndGet();
        }
        if (thumbBytes != null) {
            outputName = outputName + "-thumb";
            String thumbFileId = cloudinaryService.upload(thumbBytes, outputName);
            track.setAlbumThumbnailId(thumbFileId);
            imagesAdded.incrementAndGet();
        }
        if (bytes != null || thumbBytes != null)
            trackRepo.save(track);
    }

    private String getSafeName(String... parts)
    {
        return Arrays.stream(parts)
                .map(CommonUtil::escapeForFileSystem)
                .collect(Collectors.joining("/"));
    }

    private Artwork getArtwork(File file)
    {
        try {
            AudioFile audioFile = AudioFileIO.read(file);
            Tag tag = audioFile.getTag();
            Artwork artwork = tag.getFirstArtwork();
            if (artwork != null && artwork.getBinaryData() == null)
                log.error("Artwork tag is present but no binary data is present for " + file.getAbsolutePath());
            if (artwork != null && artwork.getBinaryData() != null)
                return artwork;
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        return null;
    }

    // look for a file with a name starting with 'folder' in the track's directory
    private File findAdjacentArtworkFile(Track track)
    {
        Path trackFolder = Paths.get(track.getPath()).getParent();
        if (trackFolder.toFile().isDirectory())
        {
            File[] files = trackFolder.toFile()
                    .listFiles(file -> file.isFile() && file.getName().toLowerCase().startsWith("folder"));
            if (files != null && files.length > 0)
                return files[0];
        }

        return null;
    }
}
