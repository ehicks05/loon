package net.ehicks.loon.beans;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "user_state")
public class UserState implements Serializable
{
    @Id
    private Long id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "id")
    @JsonIgnore
    private User user;

    private Long lastPlaylistId = 0L;
    private Long lastTrackId = 1L;
    private boolean shuffle = false;
    private Double volume = 0D;

    @Override
    public boolean equals(Object obj)
    {
        if (!(obj instanceof UserState)) return false;
        UserState that = (UserState) obj;
        return this.id.equals(that.getId());
    }

    @Override
    public int hashCode()
    {
        return id.hashCode();
    }

    public String toString()
    {
        return this.getClass().getSimpleName() + ":" + id;
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

    public User getUser()
    {
        return user;
    }

    public void setUser(User user)
    {
        this.user = user;
    }

    public Long getLastPlaylistId()
    {
        return lastPlaylistId;
    }

    public void setLastPlaylistId(Long lastPlaylistId)
    {
        this.lastPlaylistId = lastPlaylistId;
    }

    public Long getLastTrackId()
    {
        return lastTrackId;
    }

    public void setLastTrackId(Long lastTrackId)
    {
        this.lastTrackId = lastTrackId;
    }

    public boolean isShuffle()
    {
        return shuffle;
    }

    public void setShuffle(boolean shuffle)
    {
        this.shuffle = shuffle;
    }

    public Double getVolume()
    {
        return volume;
    }

    public void setVolume(Double volume)
    {
        this.volume = volume;
    }
}
