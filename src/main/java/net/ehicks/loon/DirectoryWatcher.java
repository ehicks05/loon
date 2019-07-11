package net.ehicks.loon;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.tasks.LibrarySyncTask;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.nio.file.*;

@Service
public class DirectoryWatcher
{
    private static final Logger log = LoggerFactory.getLogger(DirectoryWatcher.class);

    private LoonSystemRepository loonSystemRepo;
    private LibrarySyncTask librarySyncTask;
    private static boolean changeDetected = false;
    private static WatchService watchService;

    public DirectoryWatcher(LoonSystemRepository loonSystemRepo, LibrarySyncTask librarySyncTask)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.librarySyncTask = librarySyncTask;
    }

    @Scheduled(fixedDelay = 30 * 1000)
    public void triggerScan()
    {
        handleChangeDetected();
    }

    private void handleChangeDetected()
    {
        if (changeDetected && !librarySyncTask.isRunning())
        {
            changeDetected = false;
            new Thread(librarySyncTask::run).start();
        }
    }

    @Async
    public void watch()
    {
        try
        {
            LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
            if (!loonSystem.isDirectoryWatcherEnabled())
            {
                if (watchService != null)
                    watchService.close();

                return;
            }
            
            if (watchService != null)
                watchService.close();

            watchService = FileSystems.getDefault().newWatchService();

            Path path = Paths.get(loonSystem.getMusicFolder());
            path.register(watchService,
                    StandardWatchEventKinds.ENTRY_CREATE,
                    StandardWatchEventKinds.ENTRY_DELETE,
                    StandardWatchEventKinds.ENTRY_MODIFY);

            WatchKey watchKey;
            while ((watchKey = watchService.take()) != null)
            {
                for (WatchEvent<?> event : watchKey.pollEvents())
                {
                    log.info("Event kind:" + event.kind() + ". File affected: " + event.context() + ".");
                    changeDetected = true;
                    handleChangeDetected();
                }
                watchKey.reset();
            }
        }
        catch (InterruptedException e)
        {
            // gets thrown on shutdown.
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }
}