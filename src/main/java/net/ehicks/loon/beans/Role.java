package net.ehicks.loon.beans;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "loon_roles")
public class Role implements Serializable
{
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "logon_id", nullable = false)
    private String logonId = "";

    @Column(name = "role_name", nullable = false, unique = true)
    private String roleName = "";

    public Role()
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
        return roleName;
    }

    // -------- Magic ----------
//    public static List<Role> getByUserId(Long userId)
//    {
//        return EOI.executeQuery("select * from loon_roles where user_id=?", Arrays.asList(userId));
//    }
//
//    public static Role getByUserIdAndRoleName(Long userId, String roleName)
//    {
//        return EOI.executeQueryOneResult("select * from loon_roles where user_id=? and role_name=?", Arrays.asList(userId, roleName));
//    }

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

    public String getLogonId()
    {
        return logonId;
    }

    public void setLogonId(String logonId)
    {
        this.logonId = logonId;
    }

    public String getRoleName()
    {
        return roleName;
    }

    public void setRoleName(String roleName)
    {
        this.roleName = roleName;
    }
}
