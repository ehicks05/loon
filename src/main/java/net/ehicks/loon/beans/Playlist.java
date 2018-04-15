package net.ehicks.loon.beans;

import com.google.gson.*;
import net.ehicks.eoi.EOI;
import net.ehicks.loon.UserSession;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "playlists")
public class Playlist implements Serializable
{
    @Id
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "bigint not null auto_increment primary key")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "name", nullable = false)
    private String name = "";

    public static class Serializer implements JsonSerializer<Playlist>
    {
        @Override
        public JsonElement serialize(Playlist src, Type typeOfSrc, JsonSerializationContext context)
        {
            JsonArray playlistTrackIds = new JsonArray();

            PlaylistTrack.getByPlaylistId(src.getId())
                    .stream().map(PlaylistTrack::getTrackId).forEach(playlistTrackIds::add);

            JsonObject jsonPlaylist = new JsonObject();

            jsonPlaylist.addProperty("id", src.getId());
            jsonPlaylist.addProperty("name", src.getName());
            jsonPlaylist.add("trackIds", playlistTrackIds);

            return jsonPlaylist;
        }
    }
    
    @Override
    public boolean equals(Object obj)
    {
        if (!(obj instanceof Playlist)) return false;
        Playlist that = (Playlist) obj;
        return this.id.equals(that.getId());
    }

    @Override
    public int hashCode()
    {
        return 17 * 37 * id.intValue();
    }

    public String toString()
    {
        return this.getClass().getSimpleName() + ":" + id.toString();
    }

    public static List<Playlist> getAll()
    {
        return EOI.executeQuery("select * from playlists");
    }

    public static Playlist getById(Long id)
    {
        return EOI.executeQueryOneResult("select * from playlists where id=?", Arrays.asList(id));
    }

    public static List<Playlist> getByUserId(Long userId)
    {
        return EOI.executeQuery("select * from playlists where user_id=?", Arrays.asList(userId));
    }

    public int getSize()
    {
        return PlaylistTrack.getByPlaylistId(id).size();
    }

    public void setTrackIds(List<Long> newTrackIds, UserSession userSession)
    {
        List<Long> currentTrackIds = PlaylistTrack.getByPlaylistId(id).stream()
                .map(PlaylistTrack::getTrackId).collect(Collectors.toList());

        List<Long> trackIdsToRemove = new ArrayList<>(currentTrackIds);
        trackIdsToRemove.removeAll(newTrackIds);

        List<Long> trackIdsToAdd = new ArrayList<>(newTrackIds);
        trackIdsToAdd.removeAll(currentTrackIds);

        trackIdsToRemove.forEach(trackId -> {
            PlaylistTrack playlistTrack = PlaylistTrack.getById(trackId);
            EOI.executeDelete(playlistTrack, userSession);
        });

        trackIdsToAdd.forEach(trackId -> {
            PlaylistTrack playlistTrack = new PlaylistTrack();
            playlistTrack.setPlaylistId(id);
            playlistTrack.setTrackId(trackId);
            EOI.insert(playlistTrack, userSession);
        });
    }

    // -------- Getters / Setters ----------

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getUserId()
    {
        return userId;
    }

    public void setUserId(Long userId)
    {
        this.userId = userId;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }
}
