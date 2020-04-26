package net.ehicks.loon.tasks;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wrapper.spotify.SpotifyApi;
import com.wrapper.spotify.exceptions.SpotifyWebApiException;
import com.wrapper.spotify.model_objects.credentials.ClientCredentials;
import com.wrapper.spotify.model_objects.specification.AlbumSimplified;
import com.wrapper.spotify.model_objects.specification.Artist;
import com.wrapper.spotify.model_objects.specification.Paging;
import com.wrapper.spotify.requests.authorization.client_credentials.ClientCredentialsRequest;
import com.wrapper.spotify.requests.data.search.simplified.SearchAlbumsRequest;
import com.wrapper.spotify.requests.data.search.simplified.SearchArtistsRequest;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.makers.FixedSizeThumbnailMaker;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.apache.hc.core5.http.ParseException;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.images.Artwork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

import static net.ehicks.loon.CommonUtil.escapeForFileSystem;

@Configuration
public class ImageScanner extends Task
{
    private static final Logger log = LoggerFactory.getLogger(ImageScanner.class);
    public String id = "ImageScanner";
    private String outputFormat = "png";
    private AtomicInteger imagesAdded = new AtomicInteger();
    private Set<Track> tracksUpdated = new HashSet<>();

    public String getId()
    {
        return id;
    }

    private LoonSystemRepository loonSystemRepo;
    private TrackRepository trackRepo;
    private TaskWatcher taskWatcher;

    public ImageScanner(LoonSystemRepository loonSystemRepo, TrackRepository trackRepo, TaskWatcher taskWatcher)
    {
        super(taskWatcher);
        this.loonSystemRepo = loonSystemRepo;
        this.trackRepo = trackRepo;
        this.taskWatcher = taskWatcher;

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
        tracksUpdated.clear();

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

            List<Track> tracks = trackRepo.findAll();
            tracks.removeIf(track -> track.getArtist().isEmpty() || track.getAlbum().isEmpty());

            for (Track track : tracks)
            {
                try
                {
                    Files.createDirectories(artPath.resolve(escapeForFileSystem(track.getArtist())));
                    Files.createDirectories(artPath.resolve(escapeForFileSystem(track.getAlbumArtist())).resolve("albums"));

                    processArtistImage(track, loonSystem, artPath);
                    processAlbumImage(track, loonSystem, artPath);
                    processThumbnails(track, artPath);
                }
                catch (Exception e)
                {
                    log.error(e.getMessage(), e);
                }

                int progress = (int) ((tracksProcessed.incrementAndGet() * 100) / (double) tracks.size());
                taskWatcher.update(id, progress);
            }

            trackRepo.saveAll(tracksUpdated);

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
    private void processArtistImage(Track track, LoonSystem loonSystem, Path artPath) throws IOException
    {
        String escapedArtist = escapeForFileSystem(track.getArtist());
        String imageName = escapedArtist + "." + outputFormat;
        Path out = Paths.get(artPath.toFile().getCanonicalPath(), escapedArtist, imageName);

        // make sure file still exists and is linked
        if (out.toFile().exists())
        {
            if (track.getArtistImageId().isEmpty())
            {
                track.setArtistImageId(escapedArtist + "/" + imageName);
                tracksUpdated.add(track);
            }

            return;
        }

        String imageUrl = getImageUrl(loonSystem, track.getArtist(), null);
        if (imageUrl != null && !imageUrl.isEmpty())
            ingestImage(new URL(imageUrl), out, track, artPath, false);
    }

    // album image will be sourced in order of preference from:
    // 1. 'folder.jpg' in same folder as the track
    // 2. artwork embedded inside the track.
    // 3. spotify
    private void processAlbumImage(Track track, LoonSystem loonSystem, Path artPath) throws Exception
    {
        String escapedAlbumArtist = escapeForFileSystem(track.getAlbumArtist());
        String escapedAlbum = escapeForFileSystem(track.getAlbum());
        String imageName = escapedAlbum + "." + outputFormat;
        Path out = Paths.get(artPath.toFile().getCanonicalPath(), escapedAlbumArtist, "albums", imageName);

        File adjacentArtworkFile = findAdjacentArtworkFile(track);

        File musicFile = Paths.get(track.getPath()).toFile();
        AudioFile audioFile = AudioFileIO.read(musicFile);
        Tag tag = audioFile.getTag();
        Artwork artwork = tag.getFirstArtwork();
        boolean embeddedArtPresent = artwork != null && artwork.getBinaryData() != null;
        if (artwork != null && artwork.getBinaryData() == null)
            log.error("Artwork tag is present but no binary data is present for " + track);

        // make sure file still exists and is linked
        if (out.toFile().exists())
        {
            // check for newer versions of image
            boolean isCurrent = false;

            // check adjacentArtworkFile
            if (adjacentArtworkFile != null)
            {
                if (adjacentArtworkFile.lastModified() > out.toFile().lastModified())
                    ingestImage(adjacentArtworkFile, out, track, artPath, true);
                isCurrent = true;
            }

            // check embedded artwork
            if (!isCurrent)
            {
                if (embeddedArtPresent)
                {
                    if (musicFile.lastModified() > out.toFile().lastModified())
                        ingestImage(artwork.getBinaryData(), out, track, artPath, true);

                    isCurrent = true;
                }
            }

            if (track.getAlbumImageId().isEmpty())
            {
                track.setAlbumImageId(escapedAlbumArtist + "/albums/" + imageName);
                tracksUpdated.add(track);
            }

            return;
        }

        // check adjacentArtworkFile
        if (adjacentArtworkFile != null)
        {
            ingestImage(adjacentArtworkFile, out, track, artPath, true);
            return;
        }

        // check embedded artwork
        if (embeddedArtPresent)
        {
            ingestImage(artwork.getBinaryData(), out, track, artPath, true);
            return;
        }

        // check spotify
        String imageUrl = getImageUrl(loonSystem, track.getAlbumArtist(), track.getAlbum());
        if (imageUrl != null && !imageUrl.isEmpty())
            ingestImage(new URL(imageUrl), out, track, artPath, true);
    }

    // look for a file with a name starting with 'folder' in the track's directory
    private File findAdjacentArtworkFile(Track track)
    {
        Path trackFolder = Paths.get(track.getPath()).getParent();
        if (trackFolder.toFile().isDirectory())
        {
            File[] files = trackFolder.toFile().listFiles(file -> file.isFile() && file.getName().toLowerCase().startsWith("folder"));
            if (files.length > 0)
                return files[0];
        }

        return null;
    }

    /** Get image url from spotify api. Pass in null for the album to get artist art */
    private String getImageUrl(LoonSystem loonSystem, String artist, String album)
    {
        if (loonSystem.getSpotifyClientId().isEmpty() || loonSystem.getSpotifyClientSecret().isEmpty())
            return null;

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

            if (album == null)
            {
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
            }
            else
            {
                SearchAlbumsRequest searchAlbumsRequest = spotifyApi.searchAlbums("album:" + album + " artist:" + artist)
                        .limit(1)
                        .build();

                final Paging<AlbumSimplified> albumPaging = searchAlbumsRequest.execute();
                if (albumPaging.getItems().length > 0)
                {
                    AlbumSimplified albumSimplified = albumPaging.getItems()[0];
                    if (albumSimplified.getImages().length > 0)
                        return albumSimplified.getImages()[0].getUrl();
                }
            }

        } catch (IOException | ParseException | SpotifyWebApiException e) {
            log.error(e.getMessage());
        }

        return null;
    }

    private void processThumbnails(Track track, Path artPath)
    {
        if (!track.getArtistImageId().isEmpty())
        {
            Path original = artPath.resolve(track.getArtistImageId());
            Path thumbPath = getThumbnailPath(original);

            boolean saveTrack = false;
            if (!thumbPath.toFile().exists() || thumbPath.toFile().lastModified() < original.toFile().lastModified())
            {
                makeThumbnail(original);
                saveTrack = true;
            }

            if ((track.getArtistThumbnailId().isEmpty() && thumbPath.toFile().exists()) || saveTrack)
            {
                String escapedArtist = escapeForFileSystem(track.getArtist());
                track.setArtistThumbnailId(escapedArtist + "/" + thumbPath.getFileName().toString());
                tracksUpdated.add(track);
            }
        }
        if (!track.getAlbumImageId().isEmpty())
        {
            Path original = artPath.resolve(track.getAlbumImageId());
            Path thumbPath = getThumbnailPath(original);

            boolean saveTrack = false;
            if (!thumbPath.toFile().exists() || thumbPath.toFile().lastModified() < original.toFile().lastModified())
            {
                makeThumbnail(original);
                saveTrack = true;
            }

            if ((track.getAlbumThumbnailId().isEmpty() && thumbPath.toFile().exists()) || saveTrack)
            {
                String escapedAlbumArtist = escapeForFileSystem(track.getAlbumArtist());
                String escapedAlbum = escapeForFileSystem(track.getAlbum());
                track.setAlbumThumbnailId(escapedAlbumArtist + "/albums/" + thumbPath.getFileName().toString());
                tracksUpdated.add(track);
            }
        }
    }

    private BufferedImage makeSquare(BufferedImage img)
    {
        if (img == null)
            return null;

        int w = img.getWidth();
        int h = img.getHeight();

        if (w == h)
            return img;

        int size = Math.max(w, h);

        BufferedImage finalImage = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics g = finalImage.getGraphics();
        BufferedImage background = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics gBackground = background.getGraphics();
        gBackground.setColor(new Color(0, 0, 0, 0));
        gBackground.fillRect(0, 0, size, size);

        int x = 0;
        int y = 0;
        if (img.getWidth() < size)
            x = (size - img.getWidth()) / 2;
        if (img.getHeight() < size)
            y = (size - img.getHeight()) / 2;

        g.drawImage(background, 0, 0, null);
        g.drawImage(img, x, y, null);

        return finalImage;
    }

    private String makeThumbnail(Path original)
    {
        if (!original.toFile().exists())
            return null;

        int size = 300;
        Path thumbnail = getThumbnailPath(original);
        try
        {
            if (!thumbnail.toFile().exists())
            {
                BufferedImage img = ImageIO.read(original.toFile());

                BufferedImage thumbnailImage = new FixedSizeThumbnailMaker()
                        .size(size, size)
                        .keepAspectRatio(true)
                        .fitWithinDimensions(true)
                        .make(img);

                Thumbnails.of(thumbnailImage).size(size, size).outputFormat(outputFormat).toFile(thumbnail.toFile());
            }
            return thumbnail.toFile().getName();
        }
        catch (Exception e)
        {
            log.error(original + ": " + e.getMessage(), e);
        }

        return null;
    }

    private Path getThumbnailPath(Path original)
    {
        String originalName = original.getFileName().toString();
        String thumbFilename = "thumb-" + originalName.substring(0, originalName.lastIndexOf(".")) + "." + outputFormat;
        return original.getRoot().resolve(original.subpath(0, original.getNameCount() - 1).resolve(thumbFilename));
    }

    private void ingestImage(File inFile, Path out, Track track, Path artPath, boolean isAlbumArt)
    {
        try
        {
            ingestImage(ImageIO.read(inFile), out, track, artPath, isAlbumArt);
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }

    private void ingestImage(URL inURL, Path out, Track track, Path artPath, boolean isAlbumArt)
    {
        try
        {
            ingestImage(ImageIO.read(inURL), out, track, artPath, isAlbumArt);
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }

    private void ingestImage(byte[] inBytes, Path out, Track track, Path artPath, boolean isAlbumArt)
    {
        try (InputStream in = new ByteArrayInputStream(inBytes))
        {
            ingestImage(ImageIO.read(in), out, track, artPath, isAlbumArt);
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }

    private void ingestImage(BufferedImage in, Path out, Track track, Path artPath, boolean isAlbumArt)
    {
        try
        {
            BufferedImage image = makeSquare(in);
            ImageIO.write(image, outputFormat, out.toFile());

            imagesAdded.incrementAndGet();

            if (isAlbumArt)
            {
                String escapedAlbumArtist = escapeForFileSystem(track.getAlbumArtist());
                String escapedAlbum = escapeForFileSystem(track.getAlbum());
                String imageName = escapedAlbum + "." + outputFormat;
                track.setAlbumImageId(escapedAlbumArtist + "/albums/" + imageName);
            }
            else
            {
                String escapedArtist = escapeForFileSystem(track.getArtist());
                String imageName = escapedArtist + "." + outputFormat;
                track.setArtistImageId(escapedArtist + "/" + imageName);
            }
            tracksUpdated.add(track);

            // make thumbnail
            processThumbnails(track, artPath);
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }
}
