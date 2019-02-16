package net.ehicks.loon.beans;

import com.fasterxml.jackson.annotation.JsonIgnore;
import net.ehicks.common.Common;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "tracks")
public class Track implements Serializable
{
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    @Column(name = "artist", nullable = false)
    private String artist = "";

    @Column(name = "title", nullable = false)
    private String title = "";

    @Column(name = "album", nullable = false)
    private String album = "";

    @Column(name = "album_artist", nullable = false)
    private String albumArtist = "";

    @Column(name = "path", nullable = false)
    @JsonIgnore
    private String path = "";

    private String extension = "";

    @Column(name = "duration", nullable = false)
    private Long duration;

    @Column(name = "size", nullable = false)
    @JsonIgnore
    private Long size;

    @Column(name = "track_gain", nullable = false)
    @JsonIgnore
    private String trackGain = "";

    @Column(name = "track_gain_linear", nullable = false)
    private String trackGainLinear = "";

    @Column(name = "track_peak", nullable = false)
    @JsonIgnore
    private String trackPeak = "";

    @Column(name = "artwork_db_file_id")
    private Long artworkDbFileId;

    @Column(length = 1000)
    private String artistImageId = "";
    @Column(length = 1000)
    private String albumImageId = "";

    @OneToMany(mappedBy = "track", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Set<PlaylistTrack> playlistTracks = new HashSet<>();

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Track track = (Track) o;
        return id.equals(track.id);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id);
    }

    @Override
    public String toString()
    {
        return "Track{" +
                "id=" + id +
                ", artist='" + artist + '\'' +
                ", title='" + title + '\'' +
                ", album='" + album + '\'' +
                ", albumArtist='" + albumArtist + '\'' +
                ", path='" + path + '\'' +
                ", extension='" + extension + '\'' +
                ", duration=" + duration +
                ", size=" + size +
                ", trackGain='" + trackGain + '\'' +
                ", trackGainLinear='" + trackGainLinear + '\'' +
                ", trackPeak='" + trackPeak + '\'' +
                ", artworkDbFileId=" + artworkDbFileId +
                '}';
    }

    public String convertDBToLinear()
    {
//        db-to-linear(x) = 10^(x / 20)
        BigDecimal dbAdjustment = Common.stringToBigDecimal(trackGain.replace(" dB", ""));
        BigDecimal twenty = new BigDecimal("20");
        BigDecimal result = BigDecimal.valueOf(Math.pow(10,
                dbAdjustment.divide(twenty, 3, RoundingMode.HALF_UP).doubleValue())).setScale(3, RoundingMode.HALF_UP);
        return result.toString();
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

    public String getArtist()
    {
        return artist;
    }

    public void setArtist(String artist)
    {
        this.artist = artist;
    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getAlbum()
    {
        return album;
    }

    public void setAlbum(String album)
    {
        this.album = album;
    }

    public String getAlbumArtist()
    {
        return albumArtist;
    }

    public void setAlbumArtist(String albumArtist)
    {
        this.albumArtist = albumArtist;
    }

    public String getPath()
    {
        return path;
    }

    public void setPath(String path)
    {
        this.path = path;
    }

    public String getExtension()
    {
        return extension;
    }

    public void setExtension(String extension)
    {
        this.extension = extension;
    }

    public Long getDuration()
    {
        return duration;
    }

    public void setDuration(Long duration)
    {
        this.duration = duration;
    }

    public Long getSize()
    {
        return size;
    }

    public void setSize(Long size)
    {
        this.size = size;
    }

    public String getTrackGain()
    {
        return trackGain;
    }

    public void setTrackGain(String trackGain)
    {
        this.trackGain = trackGain;
    }

    public String getTrackGainLinear()
    {
        return trackGainLinear;
    }

    public void setTrackGainLinear(String trackGainLinear)
    {
        this.trackGainLinear = trackGainLinear;
    }

    public String getTrackPeak()
    {
        return trackPeak;
    }

    public void setTrackPeak(String trackPeak)
    {
        this.trackPeak = trackPeak;
    }

    public Long getArtworkDbFileId()
    {
        return artworkDbFileId;
    }

    public void setArtworkDbFileId(Long artworkDbFileId)
    {
        this.artworkDbFileId = artworkDbFileId;
    }

    public String getArtistImageId()
    {
        return artistImageId;
    }

    public void setArtistImageId(String artistImageId)
    {
        this.artistImageId = artistImageId;
    }

    public String getAlbumImageId()
    {
        return albumImageId;
    }

    public void setAlbumImageId(String albumImageId)
    {
        this.albumImageId = albumImageId;
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
