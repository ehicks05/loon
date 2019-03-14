package net.ehicks.loon.beans;

import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PlaylistTrackPK implements Serializable
{
    private Long playlist;
    private String track;

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PlaylistTrackPK that = (PlaylistTrackPK) o;
        return Objects.equals(playlist, that.playlist) &&
                Objects.equals(track, that.track);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(playlist, track);
    }

    @Override
    public String toString()
    {
        return "PlaylistTrackPK{" +
                "playlist=" + playlist +
                ", track=" + track +
                '}';
    }

    public Long getPlaylist()
    {
        return playlist;
    }

    public void setPlaylist(Long playlist)
    {
        this.playlist = playlist;
    }

    public String getTrack()
    {
        return track;
    }

    public void setTrack(String track)
    {
        this.track = track;
    }
}