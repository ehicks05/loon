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
@Table(name = "playlists")
public class Playlist implements Serializable
{
    @Id
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "bigint not null auto_increment primary key")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "name", nullable = false)
    private String name = "";

    @Override
    public boolean equals(Object obj)
    {
        if (!(obj instanceof Playlist)) return false;
        Playlist that = (Playlist) obj;
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

    public static List<Playlist> getAll()
    {
        return EOI.executeQuery("select * from playlists");
    }

    public static Playlist getById(Long id)
    {
        return EOI.executeQueryOneResult("select * from playlists where id=?", Arrays.asList(id));
    }

    public static List<Playlist> getByUserId(Long userId)
    {
        return EOI.executeQuery("select * from playlists where user_id=?", Arrays.asList(userId));
    }

    public int getSize()
    {
        return PlaylistTrack.getByPlaylistId(id).size();
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
}
