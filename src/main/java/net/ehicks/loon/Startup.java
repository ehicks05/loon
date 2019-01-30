package net.ehicks.loon;

import net.ehicks.loon.repos.TrackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Startup
{
    private static final Logger log = LoggerFactory.getLogger(Startup.class);
    private Seeder seeder;
    private MusicScanner musicScanner;
    private TrackRepository trackRepo;

    public Startup(Seeder seeder, MusicScanner musicScanner, TrackRepository trackRepo)
    {
        this.seeder = seeder;
        this.musicScanner = musicScanner;
        this.trackRepo = trackRepo;
    }

    void start()
    {
        seeder.createLoonSystem();
        seeder.createDefaultRoles();
        seeder.createDefaultUsers(); // requires roles to exist

        if (trackRepo.count() == 0)
            musicScanner.scan(); // needs music file path from loonSystem
    }
}
