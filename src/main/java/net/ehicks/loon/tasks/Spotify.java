package net.ehicks.loon.tasks;

import com.wrapper.spotify.SpotifyApi;
import com.wrapper.spotify.exceptions.SpotifyWebApiException;
import com.wrapper.spotify.model_objects.credentials.ClientCredentials;
import com.wrapper.spotify.model_objects.specification.AlbumSimplified;
import com.wrapper.spotify.model_objects.specification.Artist;
import com.wrapper.spotify.model_objects.specification.Paging;
import com.wrapper.spotify.requests.authorization.client_credentials.ClientCredentialsRequest;
import com.wrapper.spotify.requests.data.search.simplified.SearchAlbumsRequest;
import com.wrapper.spotify.requests.data.search.simplified.SearchArtistsRequest;
import org.apache.hc.core5.http.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class Spotify {
    private static final Logger log = LoggerFactory.getLogger(Spotify.class);

    @Value("${SPOTIFY_CLIENT_ID}")
    private String SPOTIFY_CLIENT_ID;

    @Value("${SPOTIFY_CLIENT_SECRET}")
    private String SPOTIFY_CLIENT_SECRET;

    /** Get image url from spotify api. Pass in null for the album to get artist art */
    public String getImageUrl(String artist, String album) {
        if (SPOTIFY_CLIENT_ID.isEmpty() || SPOTIFY_CLIENT_SECRET.isEmpty())
            return null;

        SpotifyApi spotifyApi = new SpotifyApi.Builder()
                .setClientId(SPOTIFY_CLIENT_ID)
                .setClientSecret(SPOTIFY_CLIENT_SECRET)
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
}
