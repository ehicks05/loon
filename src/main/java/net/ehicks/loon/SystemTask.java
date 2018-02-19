package net.ehicks.loon;

import net.ehicks.eoi.AuditUser;

public enum SystemTask implements AuditUser
{
    SEEDER("SEEDER"),
    STARTUP("STARTUP");

    private String id;

    SystemTask(String id)
    {
        this.id = id;
    }

    @Override
    public String getId()
    {
        return id;
    }

    @Override
    public String getIpAddress()
    {
        return "LOCALHOST";
    }
}
