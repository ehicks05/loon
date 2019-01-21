package net.ehicks.loon;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class Startup
{
    private static final Logger log = LoggerFactory.getLogger(Startup.class);
    private Seeder seeder;
    private MusicScanner musicScanner;

    public Startup(Seeder seeder, MusicScanner musicScanner)
    {
        this.seeder = seeder;
        this.musicScanner = musicScanner;
    }

    void start()
    {
        if (true)
        {
            seeder.createLoonSystem();
            seeder.createUsers();;
        }

        musicScanner.scan(); // needs music file path from loonSystem

        if (true)
            seeder.createPlaylists(); // needs music tracks to have been loaded
    }

    /** url, icon name, label, tab2 of the url */
    public List<List<String>> getSettingsSubscreens()
    {
        return Arrays.asList(
                Arrays.asList("view?tab1=settings&tab2=savedSearches&action=form", "search", "Saved Searches", "savedSearches"),
                Arrays.asList("view?tab1=settings&tab2=subscriptions&action=form", "envelope", "Subscriptions", "subscriptions")
        );
    }

    /** url, icon name, label, tab2 of the url */
    public List<List<String>> getAdminSubscreens()
    {
        return Arrays.asList(
                Arrays.asList("view?tab1=admin&tab2=system&tab3=modify&action=form", "server", "Manage System", "system"),
                Arrays.asList("view?tab1=admin&tab2=users&action=form", "user", "Manage Users", "users"),
                Arrays.asList("view?tab1=admin&tab2=system&tab3=info&action=form", "chart-bar", "System Info", "system"),
                Arrays.asList("view?tab1=admin&tab2=logs&action=form", "file-alt", "Logs", "logs"),
                Arrays.asList("view?tab1=admin&tab2=backups&action=form", "cloud-upload-alt", "Backups", "backups"),
                Arrays.asList("view?tab1=admin&tab2=sql&action=form", "database", "SQL", "sql")
        );
    }

    /** url, icon name, label, tab2 of the url */
    public List<Tab> getAdminScreens()
    {
        return Arrays.asList(
                new Tab("?tab1=admin&tab2=system&tab3=modify&action=form", "server", "Manage System", "system"),
                new Tab("?tab1=admin&tab2=system&tab3=info&action=form", "chart-bar", "System Info", "system"),
                new Tab("?tab1=admin&tab2=users&action=form", "user", "Manage Users", "users"),
                new Tab("?tab1=admin&tab2=logs&action=form", "file-alt", "Logs", "logs"),
                new Tab("?tab1=admin&tab2=backups&action=form", "cloud-upload-alt", "Backups", "backups"),
                new Tab("?tab1=admin&tab2=sql&action=form", "database", "SQL", "sql")
        );
    }

    public class Tab
    {
        String path;
        String icon;
        String description;
        String tab2;

        public Tab(String path, String icon, String description, String tab2)
        {
            this.path = path;
            this.icon = icon;
            this.description = description;
            this.tab2 = tab2;
        }
    }
}
