package net.ehicks.loon;

import com.google.gson.*;
import net.ehicks.loon.beans.Playlist;
import net.ehicks.loon.beans.PlaylistTrack;
import net.ehicks.loon.repos.PlaylistTrackRepository;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;

@Service
public class PlaylistSerializer implements JsonSerializer<Playlist>
{
    private PlaylistTrackRepository playlistTrackRepo;

    public PlaylistSerializer(PlaylistTrackRepository playlistTrackRepo)
    {
        this.playlistTrackRepo = playlistTrackRepo;
    }

    @Override
    public JsonElement serialize(Playlist src, Type typeOfSrc, JsonSerializationContext context)
    {
        JsonArray playlistTrackIds = new JsonArray();
        JsonArray playlistTracks = new JsonArray();

        playlistTrackRepo.findByPlaylistIdOrderByIndex(src.getId())
                .stream().map(playlistTrack -> playlistTrack.getTrack().getId()).forEach(playlistTrackIds::add);

        playlistTrackRepo.findByPlaylistIdOrderByIndex(src.getId()).forEach(playlistTrack -> {
            playlistTracks.add(context.serialize(playlistTrack));
        });

        JsonObject jsonPlaylist = new JsonObject();

        jsonPlaylist.addProperty("id", src.getId());
        jsonPlaylist.addProperty("name", src.getName());
        jsonPlaylist.add("trackIds", playlistTrackIds);
        jsonPlaylist.add("playlistTracks", playlistTracks);

        return jsonPlaylist;
    }
}
