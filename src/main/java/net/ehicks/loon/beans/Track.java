package net.ehicks.loon.beans;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    private String id;

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

    private Integer trackNumber;
    private Integer discNumber;

    @Column(name = "track_gain", nullable = false)
    @JsonIgnore
    private String trackGain = "";

    @Column(name = "track_gain_linear", nullable = false)
    private String trackGainLinear = "";

    @Column(name = "track_peak", nullable = false)
    @JsonIgnore
    private String trackPeak = "";

    @JsonIgnore
    private String musicBrainzTrackId = "";

    @Column(length = 1000)
    private String artistImageId = "";
    @Column(length = 1000)
    private String albumImageId = "";

    @OneToMany(mappedBy = "track", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private Set<PlaylistTrack> playlistTracks = new HashSet<>();

    private Boolean missingFile = false;
    private Integer sampleRate;
    private Integer bitDepth;

    @Override
    public boolean equals(Object o)
    {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Track track = (Track) o;
        return id.equals(track.id) &&
                artist.equals(track.artist) &&
                title.equals(track.title) &&
                album.equals(track.album) &&
                Objects.equals(albumArtist, track.albumArtist) &&
                path.equals(track.path) &&
                extension.equals(track.extension) &&
                duration.equals(track.duration) &&
                size.equals(track.size) &&
                Objects.equals(trackNumber, track.trackNumber) &&
                Objects.equals(discNumber, track.discNumber) &&
                Objects.equals(trackGain, track.trackGain) &&
                Objects.equals(trackGainLinear, track.trackGainLinear) &&
                Objects.equals(trackPeak, track.trackPeak) &&
                Objects.equals(missingFile, track.missingFile) &&
                Objects.equals(musicBrainzTrackId, track.musicBrainzTrackId);
    }

    @Override
    public int hashCode()
    {
        return Objects.hash(id, artist, title, album, albumArtist, path, extension, duration, size, trackNumber,
                discNumber, trackGain, trackGainLinear, trackPeak, missingFile, musicBrainzTrackId);
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
                ", missingFile='" + missingFile + '\'' +
                '}';
    }

    // db-to-linear(x) = 10^(x / 20)
    public String convertDBToLinear()
    {
        if (trackGain.isBlank())
            return BigDecimal.ZERO.toString();

        BigDecimal dbAdjustment = BigDecimal.ZERO;
        try
        {
            dbAdjustment = new BigDecimal(trackGain);
        }
        catch (Exception e)
        {

        }

        double xDividedBy20 = dbAdjustment.divide(new BigDecimal("20"), 3, RoundingMode.HALF_UP).doubleValue();
        double result = Math.pow(10, xDividedBy20);
        return BigDecimal.valueOf(result).setScale(3, RoundingMode.HALF_UP).toString();
    }

    public String getId()
    {
        return id;
    }

    public void setId(String id)
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

    public Integer getTrackNumber()
    {
        return trackNumber;
    }

    public void setTrackNumber(Integer trackNumber)
    {
        this.trackNumber = trackNumber;
    }

    public Integer getDiscNumber()
    {
        return discNumber;
    }

    public void setDiscNumber(Integer discNumber)
    {
        this.discNumber = discNumber;
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

    public String getMusicBrainzTrackId()
    {
        return musicBrainzTrackId;
    }

    public void setMusicBrainzTrackId(String musicBrainzTrackId)
    {
        this.musicBrainzTrackId = musicBrainzTrackId;
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

    public Boolean isMissingFile()
    {
        return missingFile;
    }

    public void setMissingFile(Boolean missingFile)
    {
        this.missingFile = missingFile;
    }

    public Integer getSampleRate()
    {
        return sampleRate;
    }

    public void setSampleRate(Integer sampleRate)
    {
        this.sampleRate = sampleRate;
    }

    public Integer getBitDepth()
    {
        return bitDepth;
    }

    public void setBitDepth(Integer bitDepth)
    {
        this.bitDepth = bitDepth;
    }
}
