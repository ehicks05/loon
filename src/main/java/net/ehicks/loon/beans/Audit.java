package net.ehicks.loon.beans;

import net.ehicks.eoi.EOI;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "audits")
public class Audit implements Serializable
{
    @Id
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "bigint not null auto_increment primary key")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "user_ip", nullable = false)
    private String userIp;

    @Column(name = "event_time", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date eventTime;

    @Column(name = "event_type", nullable = false)
    private String eventType = "";

    @Column(name = "object_key", nullable = false)
    private String objectKey = "";

    @Column(name = "field_name")
    private String fieldName = "";

    @Column(name = "old_value")
    private String oldValue = "";

    @Column(name = "new_value")
    private String newValue = "";

    @Override
    public boolean equals(Object obj)
    {
        if (!(obj instanceof Audit)) return false;
        Audit that = (Audit) obj;
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

    public static List<Audit> getAll()
    {
        return EOI.executeQuery("select * from audits");
    }

    public static List<Audit> getAllUpdates()
    {
        return EOI.executeQuery("select * from audits where event_type='UPDATE'");
    }

    public static Audit getById(Long id)
    {
        return EOI.executeQueryOneResult("select * from audits where id=?", Arrays.asList(id));
    }

    public static List<Audit> getByObjectKey(String objectKey)
    {
        return EOI.executeQuery("select * from audits where object_key=?", Arrays.asList(objectKey));
    }

    public String getUserName()
    {
        String userName = "";
        if (StringUtils.isNumeric(userId))
            userName = " (" + User.getByUserId(Long.valueOf(userId)).getName() + ")";

        return userName;
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

    public String getUserId()
    {
        return userId;
    }

    public void setUserId(String userId)
    {
        this.userId = userId;
    }

    public String getUserIp()
    {
        return userIp;
    }

    public void setUserIp(String userIp)
    {
        this.userIp = userIp;
    }

    public Date getEventTime()
    {
        return eventTime;
    }

    public void setEventTime(Date eventTime)
    {
        this.eventTime = eventTime;
    }

    public String getEventType()
    {
        return eventType;
    }

    public void setEventType(String eventType)
    {
        this.eventType = eventType;
    }

    public String getObjectKey()
    {
        return objectKey;
    }

    public void setObjectKey(String objectKey)
    {
        this.objectKey = objectKey;
    }

    public String getFieldName()
    {
        return fieldName;
    }

    public void setFieldName(String fieldName)
    {
        this.fieldName = fieldName;
    }

    public String getOldValue()
    {
        return oldValue;
    }

    public void setOldValue(String oldValue)
    {
        this.oldValue = oldValue;
    }

    public String getNewValue()
    {
        return newValue;
    }

    public void setNewValue(String newValue)
    {
        this.newValue = newValue;
    }
}
