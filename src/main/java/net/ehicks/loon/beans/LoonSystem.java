package net.ehicks.loon.beans;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table
public class LoonSystem implements Serializable
{
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    private String instanceName = "";
    private String logonMessage = "";
    private String theme = "";
    private String musicFolder = "";

    public LoonSystem()
    {
    }

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
