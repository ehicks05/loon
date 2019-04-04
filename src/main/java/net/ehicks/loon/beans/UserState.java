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
    private String lastTrackId = "";
    private boolean shuffle = false;
    private Boolean muted = false;
    private Double volume = 0D;

    private Integer eq1Frequency = 200;
    private Integer eq1Gain = 0;
    private Integer eq2Frequency = 1_000;
    private Integer eq2Gain = 0;
    private Integer eq3Frequency = 4_000;
    private Integer eq3Gain = 0;
    private Integer eq4Frequency = 10_000;
    private Integer eq4Gain = 0;

    private String theme = "default";

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

    public String getLastTrackId()
    {
        return lastTrackId;
    }

    public void setLastTrackId(String lastTrackId)
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

    public Boolean isMuted()
    {
        return muted;
    }

    public void setMuted(Boolean muted)
    {
        this.muted = muted;
    }

    public Double getVolume()
    {
        return volume;
    }

    public void setVolume(Double volume)
    {
        this.volume = volume;
    }

    public Boolean getMuted()
    {
        return muted;
    }

    public Integer getEq1Frequency()
    {
        return eq1Frequency;
    }

    public void setEq1Frequency(Integer eq1Frequency)
    {
        this.eq1Frequency = eq1Frequency;
    }

    public Integer getEq1Gain()
    {
        return eq1Gain;
    }

    public void setEq1Gain(Integer eq1Gain)
    {
        this.eq1Gain = eq1Gain;
    }

    public Integer getEq2Frequency()
    {
        return eq2Frequency;
    }

    public void setEq2Frequency(Integer eq2Frequency)
    {
        this.eq2Frequency = eq2Frequency;
    }

    public Integer getEq2Gain()
    {
        return eq2Gain;
    }

    public void setEq2Gain(Integer eq2Gain)
    {
        this.eq2Gain = eq2Gain;
    }

    public Integer getEq3Frequency()
    {
        return eq3Frequency;
    }

    public void setEq3Frequency(Integer eq3Frequency)
    {
        this.eq3Frequency = eq3Frequency;
    }

    public Integer getEq3Gain()
    {
        return eq3Gain;
    }

    public void setEq3Gain(Integer eq3Gain)
    {
        this.eq3Gain = eq3Gain;
    }

    public Integer getEq4Frequency()
    {
        return eq4Frequency;
    }

    public void setEq4Frequency(Integer eq4Frequency)
    {
        this.eq4Frequency = eq4Frequency;
    }

    public Integer getEq4Gain()
    {
        return eq4Gain;
    }

    public void setEq4Gain(Integer eq4Gain)
    {
        this.eq4Gain = eq4Gain;
    }

    public String getTheme()
    {
        return theme;
    }

    public void setTheme(String theme)
    {
        this.theme = theme;
    }
}
