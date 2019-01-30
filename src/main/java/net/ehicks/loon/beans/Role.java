package net.ehicks.loon.beans;

import org.springframework.data.jpa.domain.AbstractPersistable;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "loon_roles")
public class Role extends AbstractPersistable<Long> implements GrantedAuthority
{
    @Column(name = "role", nullable = false, unique = true)
    private String role = "";

    public String toString()
    {
        return role;
    }

    // -------- Getters / Setters ----------
    @Override
    public String getAuthority()
    {
        return role;
    }

    public String getRole()
    {
        return role;
    }

    public void setRole(String role)
    {
        this.role = role;
    }
}
