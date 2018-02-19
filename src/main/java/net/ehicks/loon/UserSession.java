package net.ehicks.loon;

import net.ehicks.loon.beans.Track;
import net.ehicks.loon.beans.User;
import net.ehicks.eoi.AuditUser;

import java.util.Date;
import java.util.List;

public class UserSession implements AuditUser
{
    private Long userId;
    private String logonId = "";
    private String sessionId = "";
    private String ipAddress = "";
    private Date lastActivity;
    private Long enteredController;

    public String getId()
    {
        return String.valueOf(userId);
    }

    public List<Track> getTracks()
    {
        return Track.getAll();
    }

    // ----

    public SystemInfo getSystemInfo()
    {
        return SystemInfo.INSTANCE;
    }

    public long getCurrentTimeMillis()
    {
        return System.currentTimeMillis();
    }

    public User getUser()
    {
        return User.getByUserId(userId);
    }

    public Long getUserId()
    {
        return userId;
    }

    public void setUserId(Long userId)
    {
        this.userId = userId;
    }

    public String getLogonId()
    {
        return logonId;
    }

    public void setLogonId(String logonId)
    {
        this.logonId = logonId;
    }

    public String getSessionId()
    {
        return sessionId;
    }

    public void setSessionId(String sessionId)
    {
        this.sessionId = sessionId;
    }

    public String getIpAddress()
    {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress)
    {
        this.ipAddress = ipAddress;
    }

    public Date getLastActivity()
    {
        return lastActivity;
    }

    public void setLastActivity(Date lastActivity)
    {
        this.lastActivity = lastActivity;
    }

    public Long getEnteredController()
    {
        return enteredController;
    }

    public void setEnteredController(Long enteredController)
    {
        this.enteredController = enteredController;
    }
}
