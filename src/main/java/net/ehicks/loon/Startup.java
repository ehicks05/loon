package net.ehicks.loon;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.repos.LoonSystemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

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

    @PostConstruct
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

        directoryWatcher.watch();
    }
}
