package net.ehicks.loon.beans;

import net.ehicks.common.Common;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "db_files")
public class DBFile implements Serializable
{
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name = "";

    @Column(nullable = false)
    private byte[] content;

    @Column(nullable = false)
    private Long length;

    private Long thumbnailId;

    public DBFile()
    {
    }

    public DBFile(String name, byte[] content)
    {
        this.name = name;
        this.content = content;
        this.length = (long) content.length;
    }

    @Override
    public boolean equals(Object obj)
    {
        if (!(obj instanceof DBFile)) return false;
        DBFile that = (DBFile) obj;
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

//    public DBFile getThumbnail()
//    {
//        return DBFile.getById(thumbnailId);
//    }

    public String getBase64()
    {
        return "data:image/png;base64," + Common.byteArrayToBase64(content);
    }

    public String getLengthPretty()
    {
        return Common.toMetric(length);
    }

    public String getShortName()
    {
        return name.length() > 32 ? name.substring(0, 26) : name;
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

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public byte[] getContent()
    {
        return content;
    }

    public void setContent(byte[] content)
    {
        this.content = content;
    }

    public Long getLength()
    {
        return length;
    }

    public void setLength(Long length)
    {
        this.length = length;
    }

    public Long getThumbnailId()
    {
        return thumbnailId;
    }

    public void setThumbnailId(Long thumbnailId)
    {
        this.thumbnailId = thumbnailId;
    }
}
