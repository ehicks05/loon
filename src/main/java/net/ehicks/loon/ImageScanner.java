package net.ehicks.loon;

import com.fasterxml.jackson.databind.JsonNode;
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
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

import static net.ehicks.loon.CommonUtil.escapeForFileSystem;

@Configuration
public class ImageScanner
{
    private static final Logger log = LoggerFactory.getLogger(MusicScanner.class);
    private static final String PROGRESS_KEY = "imageScan";
    private static boolean RUNNING = false;

    private LoonSystemRepository loonSystemRepo;
    private TrackRepository trackRepo;

    public ImageScanner(LoonSystemRepository loonSystemRepo, TrackRepository trackRepo)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.trackRepo = trackRepo;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    public void scan()
    {
        if (RUNNING)
            return;

        try
        {
            RUNNING = true;
            long start = System.currentTimeMillis();

            LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
            if (loonSystem == null)
                return;

            Path artPath = Paths.get(loonSystem.getDataFolder(), "art").toAbsolutePath();
            if (!artPath.toFile().exists())
            {
                log.error("artwork path does not exist");
                return;
            }

            ProgressTracker.progressStatusMap.put(PROGRESS_KEY, new ProgressTracker.ProgressStatus(0, "incomplete"));

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
                ProgressTracker.progressStatusMap.get(PROGRESS_KEY).setProgress(progress);
            }

            trackRepo.saveAll(updated);

            log.info("Scan complete: Added " + imagesAdded + " images.");
            long dur = System.currentTimeMillis() - start;
            log.info("Took " + dur + "ms (" + (imagesAdded.doubleValue() / (((double) dur) / 1000)) + " images / sec)");
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

    private String makeThumbnail(Path original)
    {
        if (original.toFile().exists())
        {
            String thumbFilename = "thumb-" + original.getFileName().toString();
            thumbFilename = thumbFilename.replace(".png", ".jpg");
            Path thumbnail = original.getRoot().resolve(original.subpath(0, original.getNameCount() - 1).resolve(thumbFilename));
            try
            {
                if (!thumbnail.toFile().exists() || true)
                {
//                    Thumbnails.of(original.toFile()).size(300, 300).keepAspectRatio(true).outputFormat("jpg").toFile(thumbnail.toFile());

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
                return thumbFilename;
            }
            catch (Exception e)
            {
                log.error(original + ": " + e.getMessage(), e);
            }
        }
        return null;
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

    /** Get image url from last.fm api. Pass in null for the album to get artist art */
    private String getImageUrlLastFm(String lastFmApiKey, String artist, String album)
    {
        RestTemplate restTemplate = restTemplate();
        ObjectMapper objectMapper = objectMapper();

        String url;
        String method;
        String jsonResponse;

        if (album == null)
        {
            url = "http://ws.audioscrobbler.com/2.0/?method={method}&artist={artist}&api_key={api_key}&format={format}";
            method = "artist.getinfo";
            jsonResponse = restTemplate.getForObject(url, String.class, method, artist, lastFmApiKey, "json");
        }
        else
        {
            url = "http://ws.audioscrobbler.com/2.0/?method={method}&artist={artist}&album={album}&api_key={api_key}&format={format}";
            method = "album.getinfo";
            jsonResponse = restTemplate.getForObject(url, String.class, method, artist, album, lastFmApiKey, "json");
        }

        String imageUrl = "";

        try
        {
            JsonNode imageLinks = album == null ?
                    objectMapper.readTree(jsonResponse).get("artist").get("image") :
                    objectMapper.readTree(jsonResponse).get("album").get("image");

            for (JsonNode imageLink : imageLinks)
            {
                if (imageLink.get("size").textValue().equals("mega"))
                    imageUrl = imageLink.get("#text").textValue();
            }
        }
        catch (Exception e)
        {
            log.error("Unable to parse response for: " + artist + " - " + (album == null ? "null album" : album));
        }
        return imageUrl;
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
//          .limit(10)
                    .build();

            final Paging<Artist> artistPaging = searchArtistsRequest.execute();

            if (artistPaging.getItems().length > 0)
            {
                Artist artistItem = artistPaging.getItems()[0];

                if (artistItem.getImages().length > 0)
                {
                    String imageUrl = artistItem.getImages()[0].getUrl();
                    return imageUrl;
                }
            }

        } catch (IOException | SpotifyWebApiException e) {
            log.error(e.getMessage());
        }

        return null;
    }
}
