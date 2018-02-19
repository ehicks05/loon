package net.ehicks.loon.beans;

import net.ehicks.eoi.EOI;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Collections;

@Entity
@Table(name = "loon_system")
public class LoonSystem implements Serializable
{
    @Id
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "bigint not null auto_increment primary key")
    private Long id;

    @Column(name = "instance_name")
    private String instanceName = "";

    @Column(name = "logon_message")
    private String logonMessage = "";

    @Column(name = "theme")
    private String theme = "";

    @Column(name = "music_folder")
    private String musicFolder = "";

    @Override
    public boolean equals(Object obj)
    {
        if (!(obj instanceof User)) return false;
        User that = (User) obj;
        return this.id.equals(that.getId());
    }

    @Override
    public int hashCode()
    {
        return 17 * 37 * id.intValue();
    }

    public String toString()
    {
        return this.getClass().getSimpleName() + ":" + id;
    }

    // --------

    public static LoonSystem getSystem()
    {
        return EOI.executeQueryOneResult("select * from loon_system");
    }

    public static LoonSystem getById(long id)
    {
        return EOI.executeQueryOneResult("select * from loon_system where id=?", Collections.singletonList(id));
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

    public String getInstanceName()
    {
        return instanceName;
    }

    public void setInstanceName(String instanceName)
    {
        this.instanceName = instanceName;
    }

    public String getLogonMessage()
    {
        return logonMessage;
    }

    public void setLogonMessage(String logonMessage)
    {
        this.logonMessage = logonMessage;
    }

    public String getTheme()
    {
        return theme;
    }

    public void setTheme(String theme)
    {
        this.theme = theme;
    }

    public String getMusicFolder()
    {
        return musicFolder;
    }

    public void setMusicFolder(String musicFolder)
    {
        this.musicFolder = musicFolder;
    }
}
