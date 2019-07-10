package net.ehicks.loon.tasks;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wrapper.spotify.SpotifyApi;
import com.wrapper.spotify.exceptions.SpotifyWebApiException;
import com.wrapper.spotify.model_objects.credentials.ClientCredentials;
import com.wrapper.spotify.model_objects.specification.Artist;
import com.wrapper.spotify.model_objects.specification.Paging;
import com.wrapper.spotify.requests.authorization.client_credentials.ClientCredentialsRequest;
import com.wrapper.spotify.requests.data.search.simplified.SearchArtistsRequest;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.makers.FixedSizeThumbnailMaker;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

import static net.ehicks.loon.CommonUtil.escapeForFileSystem;

// todo: ensure that changes to existing files are acted upon (see line 119 for an example of what needs to change)
@Configuration
public class ImageScanner extends Task
{
    private static final Logger log = LoggerFactory.getLogger(ImageScanner.class);
    public String id = "ImageScanner";

    public String getId()
    {
        return id;
    }

    private LoonSystemRepository loonSystemRepo;
    private TrackRepository trackRepo;

    public ImageScanner(LoonSystemRepository loonSystemRepo, TrackRepository trackRepo)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.trackRepo = trackRepo;

        TaskWatcher.initTask(id);
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
        try
        {
            LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
            if (loonSystem == null)
                return;

            Path artPath = Paths.get(loonSystem.getDataFolder(), "art").toAbsolutePath();
            if (!artPath.toFile().exists())
            {
                log.error("artwork path does not exist");
                return;
            }

            AtomicInteger tracksProcessed = new AtomicInteger();
            AtomicInteger imagesAdded = new AtomicInteger();

            List<Track> tracks = trackRepo.findAll();
            tracks.removeIf(track -> track.getArtist().isEmpty() || track.getAlbum().isEmpty());
            Set<Track> updated = new HashSet<>();

            for (Track track : tracks)
            {
                processArtistImage(track, loonSystem, artPath, imagesAdded, updated);
                processAlbumImage(track, loonSystem, artPath, imagesAdded, updated);
                processThumbnails(track, artPath, updated);

                int progress = (int) ((tracksProcessed.incrementAndGet() * 100) / (double) tracks.size());
                TaskWatcher.update(id, progress);
            }

            trackRepo.saveAll(updated);

            log.info("Scan complete: Added " + imagesAdded + " images.");
            long dur = System.currentTimeMillis() - (long) options.get("startTime");
            log.info("Took " + dur + "ms (" + (imagesAdded.doubleValue() / (((double) dur) / 1000)) + " images / sec)");
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }

    private void processArtistImage(Track track, LoonSystem loonSystem, Path artPath, AtomicInteger imagesAdded, Set<Track> updated)
    {
        if (track.getArtistImageId().isEmpty())
        {
            String escapedArtist = escapeForFileSystem(track.getArtist());

            Path artistPath = artPath.resolve(escapedArtist);
            File existingArt = findFileInPath(artistPath);
            if (existingArt != null)
            {
                track.setArtistImageId(escapedArtist + "/" + existingArt.getName());
                updated.add(track);
            }

            if (track.getArtistImageId().isEmpty())
            {
                try
                {
                    String imageUrl = getImageUrl(loonSystem, track.getArtist(), null);

                    if (imageUrl != null && !imageUrl.isEmpty())
                    {
                        try (InputStream in = new URL(imageUrl).openStream())
                        {
                            String imageName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1) + ".jpg";
                            Path base = Paths.get(artPath.toFile().getCanonicalPath(), escapedArtist);
                            Files.createDirectories(base);
                            Path out = base.resolve(imageName);
                            Files.copy(in, out);
                            imagesAdded.incrementAndGet();

                            track.setArtistImageId(escapedArtist + "/" + imageName);
                            updated.add(track);
                        }
                    }
                }
                catch (Exception e)
                {
                    log.error(e.getMessage(), e);
                }
            }
        }
    }

    private void processAlbumImage(Track track, LoonSystem loonSystem, Path artPath, AtomicInteger imagesAdded, Set<Track> updated)
    {
        if (track.getAlbumImageId().isEmpty())
        {
            String escapedAlbumArtist = escapeForFileSystem(track.getAlbumArtist());
            String escapedAlbum = escapeForFileSystem(track.getAlbum());

            Path albumPath = artPath.resolve(Paths.get(escapedAlbumArtist, escapedAlbum));
            File existingArt = findFileInPath(albumPath);
            if (existingArt != null)
            {
                track.setAlbumImageId(escapedAlbumArtist + "/" + escapedAlbum + "/" + existingArt.getName());
                updated.add(track);
            }

            if (track.getAlbumImageId().isEmpty())
            {
                try
                {
                    String imageUrl = getImageUrl(loonSystem, track.getArtist(), track.getAlbum());

                    if (imageUrl != null && !imageUrl.isEmpty())
                    {
                        try (InputStream in = new URL(imageUrl).openStream())
                        {
                            String imageName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
                            Path base = Paths.get(artPath.toFile().getCanonicalPath(), escapedAlbumArtist, escapedAlbum);
                            Files.createDirectories(base);
                            Path out = base.resolve(imageName);
                            Files.copy(in, out);
                            imagesAdded.incrementAndGet();

                            track.setAlbumImageId(escapedAlbumArtist + "/" + escapedAlbum + "/" + imageName);
                            updated.add(track);
                        }
                    }
                }
                catch (Exception e)
                {
                    log.error(e.getMessage(), e);
                }
            }
        }
    }

    private File findFileInPath(Path path)
    {
        if (path.toFile().exists())
        {
            File[] files = path.toFile().listFiles();
            if (files != null && files.length > 0)
                return Arrays.stream(files).filter(File::isFile).findFirst().orElse(null);
        }
        return null;
    }

    /** Get image url from spotify api. Pass in null for the album to get artist art */
    private String getImageUrl(LoonSystem loonSystem, String artist, String album)
    {
        SpotifyApi spotifyApi = new SpotifyApi.Builder()
                .setClientId(loonSystem.getSpotifyClientId())
                .setClientSecret(loonSystem.getSpotifyClientSecret())
                .build();

        ClientCredentialsRequest clientCredentialsRequest = spotifyApi.clientCredentials()
                .build();

        try {
            final ClientCredentials clientCredentials = clientCredentialsRequest.execute();

            // Set access token for further "spotifyApi" object usage
            spotifyApi.setAccessToken(clientCredentials.getAccessToken());

            SearchArtistsRequest searchArtistsRequest = spotifyApi.searchArtists(artist)
                    .limit(1)
                    .build();

            final Paging<Artist> artistPaging = searchArtistsRequest.execute();

            if (artistPaging.getItems().length > 0)
            {
                Artist artistItem = artistPaging.getItems()[0];

                if (artistItem.getImages().length > 0)
                    return artistItem.getImages()[0].getUrl();
            }

        } catch (IOException | SpotifyWebApiException e) {
            log.error(e.getMessage());
        }

        return null;
    }

    private void processThumbnails(Track track, Path artPath, Set<Track> updated)
    {
        if (!track.getArtistImageId().isEmpty() && track.getArtistThumbnailId().isEmpty())
        {
            Path original = artPath.resolve(track.getArtistImageId());
            String thumbFilename = makeThumbnail(original);
            if (thumbFilename != null)
            {
                String escapedArtist = escapeForFileSystem(track.getArtist());
                track.setArtistThumbnailId(escapedArtist + "/" + thumbFilename);
                updated.add(track);
            }
        }
        if (!track.getAlbumImageId().isEmpty() && track.getAlbumThumbnailId().isEmpty())
        {
            Path original = artPath.resolve(track.getAlbumImageId());
            String thumbFilename = makeThumbnail(original);
            if (thumbFilename != null)
            {
                String escapedAlbumArtist = escapeForFileSystem(track.getAlbumArtist());
                String escapedAlbum = escapeForFileSystem(track.getAlbum());
                track.setAlbumThumbnailId(escapedAlbumArtist + "/" + escapedAlbum + "/" + thumbFilename);
                updated.add(track);
            }
        }
    }

    private Path getThumbnailPath(Path original)
    {
        String thumbFilename = "thumb-" + original.getFileName().toString();
        thumbFilename = thumbFilename.replace(".png", ".jpg");
        return original.getRoot().resolve(original.subpath(0, original.getNameCount() - 1).resolve(thumbFilename));
    }

    private String makeThumbnail(Path original)
    {
        if (original.toFile().exists())
        {
            Path thumbnail = getThumbnailPath(original);
            try
            {
                if (!thumbnail.toFile().exists())
                {
                    BufferedImage img = ImageIO.read(original.toFile());

                    BufferedImage thumbnailImage = new FixedSizeThumbnailMaker()
                            .size(300, 300)
                            .keepAspectRatio(true)
                            .fitWithinDimensions(true)
                            .make(img);

                    BufferedImage finalImage = new BufferedImage(300, 300, BufferedImage.TYPE_INT_ARGB);
                    Graphics g = finalImage.getGraphics();
                    BufferedImage background = new BufferedImage(300, 300, BufferedImage.TYPE_INT_ARGB);
                    Graphics gBackground = background.getGraphics();
                    gBackground.setColor(new Color(0, 0, 0, 255));
                    gBackground.fillRect(0, 0, 300, 300);

                    int x = 0;
                    int y = 0;
                    if (thumbnailImage.getWidth() < 300)
                        x = (300 - thumbnailImage.getWidth()) / 2;
                    if (thumbnailImage.getHeight() < 300)
                        y = (300 - thumbnailImage.getHeight()) / 2;

                    g.drawImage(background, 0, 0, null);
                    g.drawImage(thumbnailImage, x, y, null);
                    Thumbnails.of(finalImage).size(300, 300).outputFormat("jpg").toFile(thumbnail.toFile());
                }
                return thumbnail.toFile().getName();
            }
            catch (Exception e)
            {
                log.error(original + ": " + e.getMessage(), e);
            }
        }
        return null;
    }
}
