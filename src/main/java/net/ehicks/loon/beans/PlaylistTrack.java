package net.ehicks.loon.beans;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "playlist_tracks")
public class PlaylistTrack implements Serializable
{
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    @Column(name = "playlist_id", nullable = false)
    private Long playlistId;

    @Column(name = "track_id", nullable = false)
    private Long trackId;

    @Column(name = "index", nullable = false)
    private Long index;

    public PlaylistTrack()
    {
    }

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

    public Long getIndex()
    {
        return index;
    }

    public void setIndex(Long index)
    {
        this.index = index;
    }
}
