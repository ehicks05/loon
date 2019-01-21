package net.ehicks.loon.beans;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import net.ehicks.common.Common;

import javax.persistence.*;
import java.io.Serializable;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.math.RoundingMode;

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

    public static class Serializer implements JsonSerializer<Track>
    {
        @Override
        public JsonElement serialize(Track src, Type typeOfSrc, JsonSerializationContext context)
        {
            JsonObject jsonPlaylist = new JsonObject();

            jsonPlaylist.addProperty("id", src.getId());
            jsonPlaylist.addProperty("album", src.getAlbum());
            jsonPlaylist.addProperty("artist", src.getArtist());
            jsonPlaylist.addProperty("title", src.getTitle());
            jsonPlaylist.addProperty("size", src.getSize());
            jsonPlaylist.addProperty("duration", src.getDuration());
            jsonPlaylist.addProperty("trackGain", src.getTrackGain());
            jsonPlaylist.addProperty("trackGainLinear", src.getTrackGainLinear());
            jsonPlaylist.addProperty("artworkDbFileId", src.getArtworkDbFileId());

            return jsonPlaylist;
        }
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
        BigDecimal result = BigDecimal.valueOf(Math.pow(10,
                dbAdjustment.divide(twenty, 3, RoundingMode.HALF_UP).doubleValue())).setScale(3, RoundingMode.HALF_UP);
        return result.toString();
    }

//    public DBFile getArtwork()
//    {
//        return DBFile.getById(artworkDbFileId);
//    }

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
