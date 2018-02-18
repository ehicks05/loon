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

    @Column(name = "default_avatar")
    private Long defaultAvatar;

    @Column(name = "theme")
    private String theme = "";

    @Column(name = "email_host")
    private String emailHost = "";

    @Column(name = "email_port")
    private Integer emailPort = 0;

    @Column(name = "email_user")
    private String emailUser = "";

    @Column(name = "email_password")
    private String emailPassword = "";

    @Column(name = "email_from_address")
    private String emailFromAddress = "";

    @Column(name = "email_from_name")
    private String emailFromName = "";

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

    public Long getDefaultAvatar()
    {
        return defaultAvatar;
    }

    public void setDefaultAvatar(Long defaultAvatar)
    {
        this.defaultAvatar = defaultAvatar;
    }

    public String getTheme()
    {
        return theme;
    }

    public void setTheme(String theme)
    {
        this.theme = theme;
    }

    public String getEmailHost()
    {
        return emailHost;
    }

    public void setEmailHost(String emailHost)
    {
        this.emailHost = emailHost;
    }

    public Integer getEmailPort()
    {
        return emailPort;
    }

    public void setEmailPort(Integer emailPort)
    {
        this.emailPort = emailPort;
    }

    public String getEmailUser()
    {
        return emailUser;
    }

    public void setEmailUser(String emailUser)
    {
        this.emailUser = emailUser;
    }

    public String getEmailPassword()
    {
        return emailPassword;
    }

    public void setEmailPassword(String emailPassword)
    {
        this.emailPassword = emailPassword;
    }

    public String getEmailFromAddress()
    {
        return emailFromAddress;
    }

    public void setEmailFromAddress(String emailFromAddress)
    {
        this.emailFromAddress = emailFromAddress;
    }

    public String getEmailFromName()
    {
        return emailFromName;
    }

    public void setEmailFromName(String emailFromName)
    {
        this.emailFromName = emailFromName;
    }
}
