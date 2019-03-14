package net.ehicks.loon;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.repos.LoonSystemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@Configuration
public class Startup
{
    private static final Logger log = LoggerFactory.getLogger(Startup.class);
    private Seeder seeder;
    private LoonSystemRepository loonSystemRepo;
    private DirectoryWatcher directoryWatcher;

    public Startup(Seeder seeder, LoonSystemRepository loonSystemRepo, DirectoryWatcher directoryWatcher)
    {
        this.seeder = seeder;
        this.loonSystemRepo = loonSystemRepo;
        this.directoryWatcher = directoryWatcher;
    }

    void start()
    {
        seeder.createLoonSystem();
        seeder.createDefaultRoles();
        seeder.createDefaultUsers(); // requires roles to exist

        LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
        if (loonSystem == null)
        {
            log.error("loonSystem is null");
            return;
        }

        createSystemFolders(loonSystem);

        directoryWatcher.watch();
    }

    private void createSystemFolders(LoonSystem loonSystem)
    {
        List<Path> paths = Arrays.asList(
                Paths.get(loonSystem.getDataFolder(), "art").toAbsolutePath(),
                Paths.get(loonSystem.getTranscodeFolder()).toAbsolutePath()
        );

        paths.forEach(path -> {
            if (!path.toFile().exists())
            {
                try
                {
                    Files.createDirectories(path);
                }
                catch (Exception e)
                {
                    log.info(e.getMessage(), e);
                }
            }
        });
    }
}
