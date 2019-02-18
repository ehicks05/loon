package net.ehicks.loon;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.io.File;
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
            tracks.forEach(track -> {
                tracksProcessed.incrementAndGet();

                if (track.getArtistImageId().isEmpty())
                {
                    String escapedArtist = escapeForFileSystem(track.getArtist());
                    Path artistPath = artPath.resolve(escapedArtist);
                    if (artistPath.toFile().exists())
                    {
                        File[] files = artistPath.toFile().listFiles();
                        if (files != null && files.length > 0)
                        {
                            File existingArt = Arrays.stream(files).filter(File::isFile).findFirst().orElse(null);
                            if (existingArt != null)
                            {
                                track.setArtistImageId(escapedArtist + "/" + existingArt.getName());
                                updated.add(track);
                            }
                        }
                    }

                    if (track.getArtistImageId().isEmpty())
                    {
                        try
                        {
                            String imageUrl = getImageUrl(loonSystem.getLastFmApiKey(), track.getArtist(), null);

                            if (imageUrl != null && !imageUrl.isEmpty())
                            {
                                try (InputStream in = new URL(imageUrl).openStream())
                                {
                                    String imageName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
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

                if (track.getAlbumImageId().isEmpty())
                {
                    String escapedAlbumArtist = escapeForFileSystem(track.getAlbumArtist());
                    String escapedAlbum = escapeForFileSystem(track.getAlbum());
                    Path albumPath = artPath.resolve(Paths.get(escapedAlbumArtist, escapedAlbum));
                    if (albumPath.toFile().exists())
                    {
                        File[] files = albumPath.toFile().listFiles();
                        if (files != null && files.length > 0)
                        {
                            File existingArt = Arrays.stream(files).filter(File::isFile).findFirst().orElse(null);
                            if (existingArt != null)
                            {
                                track.setAlbumImageId(escapedAlbumArtist + "/" + escapedAlbum + "/" + existingArt.getName());
                                updated.add(track);
                            }
                        }
                    }

                    if (track.getAlbumImageId().isEmpty())
                    {
                        try
                        {
                            String imageUrl = getImageUrl(loonSystem.getLastFmApiKey(), track.getArtist(), track.getAlbum());

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

                int progress = (int) ((tracksProcessed.get() * 100) / (double) tracks.size());
                ProgressTracker.progressStatusMap.get(PROGRESS_KEY).setProgress(progress);
            });


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

    /** Get image url from last.fm api. Pass in null for the album to get artist art */
    private String getImageUrl(String lastFmApiKey, String artist, String album)
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
}
