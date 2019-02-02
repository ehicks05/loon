package net.ehicks.loon.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "playlist_tracks")
@IdClass(PlaylistTrackPK.class)
public class PlaylistTrack implements Serializable
{
    @Id
    @ManyToOne
    @JoinColumn(name = "playlist_id", referencedColumnName = "id")
    private Playlist playlist;

    @Id
    @ManyToOne
    @JsonIgnoreProperties("playlistTracks")
    @JoinColumn(name = "track_id", referencedColumnName = "id")
    private Track track;

    @Column(name = "index", nullable = false)
    private Long index;

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PlaylistTrack that = (PlaylistTrack) o;
        return playlist.equals(that.playlist) &&
                track.equals(that.track);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(playlist, track);
    }

    public String toString()
    {
        return this.getClass().getSimpleName() + ":" + track.toString() + ", " + playlist.toString();
    }

    // -------- Getters / Setters ----------

    public Playlist getPlaylist()
    {
        return playlist;
    }

    public void setPlaylist(Playlist playlist)
    {
        this.playlist = playlist;
    }

    public Track getTrack()
    {
        return track;
    }

    public void setTrack(Track track)
    {
        this.track = track;
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
