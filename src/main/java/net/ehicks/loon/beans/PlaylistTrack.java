package net.ehicks.loon.beans;

import net.ehicks.eoi.EOI;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "playlist_tracks")
public class PlaylistTrack implements Serializable
{
    @Id
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "bigint not null auto_increment primary key")
    private Long id;

    @Column(name = "playlist_id", nullable = false)
    private Long playlistId;

    @Column(name = "track_id", nullable = false)
    private Long trackId;

    @Override
    public boolean equals(Object obj)
    {
        if (!(obj instanceof PlaylistTrack)) return false;
        PlaylistTrack that = (PlaylistTrack) obj;
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

    public static List<PlaylistTrack> getAll()
    {
        return EOI.executeQuery("select * from playlist_tracks");
    }

    public static PlaylistTrack getById(Long id)
    {
        return EOI.executeQueryOneResult("select * from playlist_tracks where id=?", Arrays.asList(id));
    }

    public static List<PlaylistTrack> getByPlaylistId(Long playlistId)
    {
        return EOI.executeQuery("select * from playlist_tracks where playlist_id=?", Arrays.asList(playlistId));
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

    public Long getPlaylistId()
    {
        return playlistId;
    }

    public void setPlaylistId(Long playlistId)
    {
        this.playlistId = playlistId;
    }

    public Long getTrackId()
    {
        return trackId;
    }

    public void setTrackId(Long trackId)
    {
        this.trackId = trackId;
    }
}
