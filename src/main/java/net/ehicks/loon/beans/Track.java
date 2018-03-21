package net.ehicks.loon.beans;

import net.ehicks.common.Common;
import net.ehicks.eoi.EOI;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "tracks")
public class Track implements Serializable
{
    @Id
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "bigint not null auto_increment primary key")
    private Long id;

    @Column(name = "artist", nullable = false)
    private String artist = "";

    @Column(name = "title", nullable = false)
    private String title = "";

    @Column(name = "album", nullable = false)
    private String album = "";

    @Column(name = "path", nullable = false)
    private String path;

    @Column(name = "duration", nullable = false)
    private Long duration;

    @Column(name = "size", nullable = false)
    private Long size;

    @Column(name = "track_gain", nullable = false)
    private String trackGain;

    @Column(name = "track_gain_linear", nullable = false)
    private String trackGainLinear;

    @Column(name = "track_peak", nullable = false)
    private String trackPeak;

    @Column(name = "artwork_db_file_id")
    private Long artworkDbFileId;

    public Track()
    {
    }

    public Track(String artist, String title, String path, Long duration, Long size)
    {
        this.artist = artist;
        this.title = title;
        this.path = path;
        this.duration = duration;
        this.size = size;
    }

    @Override
    public boolean equals(Object obj)
    {
        if (!(obj instanceof Track)) return false;
        Track that = (Track) obj;
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

    public static List<Track> getAll()
    {
        return EOI.executeQuery("select * from tracks");
    }

    public static int deleteAll()
    {
        return EOI.executeUpdate("delete from tracks");
    }

    public static Track getById(Long id)
    {
        return EOI.executeQueryOneResult("select * from tracks where id=?", Arrays.asList(id));
    }

    public static Track getByPath(String path)
    {
        return EOI.executeQueryOneResult("select * from tracks where path=?", Arrays.asList(path));
    }

    public String getFormattedDuration()
    {
        int minutes = (int) (Math.floor(duration / 60));
        int seconds = (int) (duration - minutes * 60);

        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    public String convertDBToLinear()
    {
//        db-to-linear(x) = 10^(x / 20)
        BigDecimal dbAdjustment = Common.stringToBigDecimal(trackGain.replace(" dB", ""));
        BigDecimal twenty = new BigDecimal("20");
        BigDecimal result = BigDecimal.valueOf(Math.pow(10, dbAdjustment.divide(twenty, 3, BigDecimal.ROUND_HALF_UP).doubleValue())).setScale(3, BigDecimal.ROUND_HALF_UP);
        return result.toString();
    }

    public DBFile getArtwork()
    {
        return DBFile.getById(artworkDbFileId);
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

    public String getPath()
    {
        return path;
    }

    public void setPath(String path)
    {
        this.path = path;
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
}
