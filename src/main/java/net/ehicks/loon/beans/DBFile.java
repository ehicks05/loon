package net.ehicks.loon.beans;

import net.ehicks.common.Common;
import net.ehicks.eoi.EOI;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "db_files")
public class DBFile implements Serializable
{
    @Id
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "bigint not null auto_increment primary key")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name = "";

    @Column(name = "content", nullable = false)
    private byte[] content;

    @Column(name = "length", nullable = false)
    private Long length;

    @Column(name = "thumbnail_id")
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

    public static List<DBFile> getAll()
    {
        return EOI.executeQuery("select * from db_files");
    }

    public static DBFile getById(Long id)
    {
        return EOI.executeQueryOneResult("select * from db_files where id=?", Arrays.asList(id));
    }

    public static DBFile getByName(String name)
    {
        return EOI.executeQueryOneResult("select * from db_files where name=?", Arrays.asList(name));
    }

    public DBFile getThumbnail()
    {
        return DBFile.getById(thumbnailId);
    }

    public String getPreviewIcon()
    {
        Map<String, String> extToPreviewIcon = new HashMap<>();
        extToPreviewIcon.put("docx", "file-word");
        extToPreviewIcon.put("pdf", "file-pdf");
        extToPreviewIcon.put("pptx", "file-powerpoint");
        extToPreviewIcon.put("xlsx", "file-excel");
        String ext = name.substring(name.lastIndexOf(".") + 1);
        return extToPreviewIcon.getOrDefault(ext, "file");
    }

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
