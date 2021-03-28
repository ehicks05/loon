package net.ehicks.loon.handlers.admin;

import net.ehicks.loon.DirectoryWatcher;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.TrackRepository;
import net.ehicks.loon.tasks.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/systemSettings")
public class AdminSystemSettingsHandler
{
    private static final Logger log = LoggerFactory.getLogger(AdminSystemSettingsHandler.class);
    private LoonSystemRepository loonSystemRepo;
    private MusicScanner musicScanner;
    private ImageScanner imageScanner;
    private TranscoderTask transcoderTask;
    private TrackRepository trackRepo;
    private DirectoryWatcher directoryWatcher;
    private TaskWatcher taskWatcher;
    private LibrarySyncTask librarySyncTask;

    public AdminSystemSettingsHandler(LoonSystemRepository loonSystemRepo, MusicScanner musicScanner,
                                      ImageScanner imageScanner, TranscoderTask transcoderTask, TrackRepository trackRepo,
                                      DirectoryWatcher directoryWatcher, TaskWatcher taskWatcher, LibrarySyncTask librarySyncTask)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.musicScanner = musicScanner;
        this.imageScanner = imageScanner;
        this.transcoderTask = transcoderTask;
        this.trackRepo = trackRepo;
        this.directoryWatcher = directoryWatcher;
        this.taskWatcher = taskWatcher;
        this.librarySyncTask = librarySyncTask;
    }

    @GetMapping("")
    public LoonSystem form()
    {
        return loonSystemRepo.findById(1L).orElse(null);
    }

    @PutMapping("")
    public LoonSystem modify(LoonSystem loonSystem, @RequestParam boolean rescan, @RequestParam boolean deleteTracksWithoutFiles,
                             @RequestParam boolean deleteLibrary, @RequestParam boolean librarySync)
    {
        // if music folder has changed, clear library before re-scanning
        LoonSystem loonSystemFromDb = loonSystemRepo.findById(1L).orElse(null);
        if (loonSystemFromDb != null && !loonSystemFromDb.getMusicFolder().equals(loonSystem.getMusicFolder()))
            deleteLibrary = true;

        loonSystem.setId(1L);
        loonSystem = loonSystemRepo.save(loonSystem);

        if (deleteTracksWithoutFiles)
            deleteTracksWithoutFiles();
        if (deleteLibrary)
            deleteLibrary();

        if (rescan)
            new Thread(musicScanner::run).start();

        if (librarySync)
            new Thread(librarySyncTask::run).start();

        directoryWatcher.watch();

        return loonSystem;
    }

    @GetMapping("/imageScan")
    public String imageScan()
    {
        new Thread(imageScanner::run).start();
        return "";
    }

    @GetMapping("/transcodeLibrary")
    public String transcodeLibrary()
    {
        new Thread(transcoderTask::run).start();
        return "";
    }

    @GetMapping("/getTaskStatuses")
    public TaskWatcher.TaskState getTaskStatuses()
    {
        return taskWatcher.getTaskState();
    }

    private void deleteTracksWithoutFiles()
    {
        log.info("Deleting tracks with no backing file...");
        List<Track> tracks = trackRepo.findAllByMissingFile(true);
        trackRepo.deleteAll(tracks);
        log.info("Done deleting tracks with no backing file...");
    }

    private void deleteLibrary()
    {
        log.info("Deleting library...");
        trackRepo.deleteAll();
        log.info("Done deleting library...");
    }
}
