package net.ehicks.loon.beans;

import net.ehicks.eoi.EOI;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "loon_users")
public class User implements Serializable
{
    @Id
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "bigint not null auto_increment primary key")
    private Long id;

    @Column(name = "logon_id", nullable = false, unique = true)
    private String logonId = "";

    @Column(name = "password", nullable = false)
    private String password = "";

    @Column(name = "first_name")
    private String firstName = "";

    @Column(name = "last_name")
    private String lastName = "";

    @Column(name = "created_on")
    @Temporal(TemporalType.DATE)
    private Date createdOn;

    @Column(name = "updated_on")
    @Temporal(TemporalType.DATE)
    private Date updatedOn;

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

    public boolean isAdmin()
    {
        return true;
    }

    public static List<User> getAll()
    {
        return EOI.executeQuery("select * from loon_users;");
    }

    public static User getByLogonId(String logonid)
    {
        return EOI.executeQueryOneResult("select * from loon_users where logon_id=?;", new ArrayList<>(Arrays.asList(logonid)));
    }

    public static User getByUserId(Long userId)
    {
        return EOI.executeQueryOneResult("select * from loon_users where id=?;", new ArrayList<>(Arrays.asList(userId)));
    }

    public String getName()
    {
        return firstName + " " + lastName;
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

    public String getLogonId()
    {
        return logonId;
    }

    public void setLogonId(String logonId)
    {
        this.logonId = logonId;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

    public String getFirstName()
    {
        return firstName;
    }

    public void setFirstName(String firstName)
    {
        this.firstName = firstName;
    }

    public String getLastName()
    {
        return lastName;
    }

    public void setLastName(String lastName)
    {
        this.lastName = lastName;
    }

    public Date getCreatedOn()
    {
        return createdOn;
    }

    public void setCreatedOn(Date createdOn)
    {
        this.createdOn = createdOn;
    }

    public Date getUpdatedOn()
    {
        return updatedOn;
    }

    public void setUpdatedOn(Date updatedOn)
    {
        this.updatedOn = updatedOn;
    }
}
