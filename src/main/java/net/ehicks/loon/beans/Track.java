package net.ehicks.loon.beans;

import net.ehicks.eoi.EOI;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
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

    @Column(name = "path", nullable = false)
    private String path;

    @Column(name = "duration", nullable = false)
    private Long duration;

    @Column(name = "size", nullable = false)
    private Long size;

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

    public String getFormattedDuration()
    {
        int minutes = (int) (Math.floor(duration / 60));
        int seconds = (int) (duration - minutes * 60);

        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
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
}
