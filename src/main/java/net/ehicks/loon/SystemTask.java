package net.ehicks.loon;

import net.ehicks.eoi.AuditUser;

public enum SystemTask implements AuditUser
{
    SEEDER("SEEDER"),
    STARTUP("STARTUP"),
    REGISTRATION_HANDLER("REGISTRATION_HANDLER"),
    EMAIL_ENGINE("EMAIL_ENGINE");

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
