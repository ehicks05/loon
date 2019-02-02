package net.ehicks.loon.beans;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "playlists")
public class Playlist implements Serializable
{
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "name", nullable = false)
    private String name = "";

    @OneToMany(mappedBy = "playlist")
    @JsonIgnoreProperties("playlist")
    private Set<PlaylistTrack> playlistTracks = new HashSet<>();

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Playlist playlist = (Playlist) o;
        return id.equals(playlist.id);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id);
    }

    @Override
    public String toString()
    {
        return "Playlist{" +
                "id=" + id +
                '}';
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

    public Set<PlaylistTrack> getPlaylistTracks()
    {
        return playlistTracks;
    }

    public void setPlaylistTracks(Set<PlaylistTrack> playlistTracks)
    {
        this.playlistTracks = playlistTracks;
    }
}
