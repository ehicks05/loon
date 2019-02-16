package net.ehicks.loon;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class Startup
{
    private static final Logger log = LoggerFactory.getLogger(Startup.class);
    private Seeder seeder;
    private MusicScanner musicScanner;
    private TrackRepository trackRepo;
    private LoonSystemRepository loonSystemRepo;

    public Startup(Seeder seeder, MusicScanner musicScanner, TrackRepository trackRepo, LoonSystemRepository loonSystemRepo)
    {
        this.seeder = seeder;
        this.musicScanner = musicScanner;
        this.trackRepo = trackRepo;
        this.loonSystemRepo = loonSystemRepo;
    }

    void start()
    {
        seeder.createLoonSystem();
        seeder.createDefaultRoles();
        seeder.createDefaultUsers(); // requires roles to exist

        if (trackRepo.count() == 0)
            musicScanner.scan(); // needs music file path from loonSystem

        LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);

        createArtworkFolder(loonSystem);
    }

    private void createArtworkFolder(LoonSystem loonSystem)
    {
        Path artPath = Paths.get(loonSystem.getDataFolder(), "art").toAbsolutePath();
        if (!artPath.toFile().exists())
        {
            try
            {
                Files.createDirectories(artPath);
            }
            catch (Exception e)
            {
                log.info(e.getMessage(), e);
            }
        }
    }
}
