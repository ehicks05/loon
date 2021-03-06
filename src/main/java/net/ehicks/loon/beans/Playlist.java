package net.ehicks.loon.beans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

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

    @OneToMany(mappedBy = "playlist", cascade = CascadeType.REMOVE)
    @JsonIgnoreProperties("playlist")
    private Set<PlaylistTrack> playlistTracks = new HashSet<>();

    private Boolean favorites = false;
    private Boolean queue = false;

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

    @JsonIgnore
    public List<String> getTrackIds()
    {
        return getPlaylistTracks().stream()
                .map(playlistTrack -> playlistTrack.getTrack().getId())
                .collect(Collectors.toList());
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

    public Boolean getFavorites()
    {
        return favorites;
    }

    public void setFavorites(Boolean favorites)
    {
        this.favorites = favorites;
    }

    public Boolean getQueue()
    {
        return queue;
    }

    public void setQueue(Boolean queue)
    {
        this.queue = queue;
    }
}
