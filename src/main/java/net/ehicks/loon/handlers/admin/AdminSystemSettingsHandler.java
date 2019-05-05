package net.ehicks.loon.handlers.admin;

import net.ehicks.loon.*;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/systemSettings")
public class AdminSystemSettingsHandler
{
    private static final Logger log = LoggerFactory.getLogger(AdminSystemSettingsHandler.class);
    private LoonSystemRepository loonSystemRepo;
    private MusicScanner musicScanner;
    private ImageScanner imageScanner;
    private TranscoderTask transcoderTask;
    private TrackRepository trackRepo;
    private DirectoryWatcher directoryWatcher;

    public AdminSystemSettingsHandler(LoonSystemRepository loonSystemRepo, MusicScanner musicScanner,
                                      ImageScanner imageScanner, TranscoderTask transcoderTask, TrackRepository trackRepo,
                                      DirectoryWatcher directoryWatcher)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.musicScanner = musicScanner;
        this.imageScanner = imageScanner;
        this.transcoderTask = transcoderTask;
        this.trackRepo = trackRepo;
        this.directoryWatcher = directoryWatcher;
    }

    @GetMapping("")
    public LoonSystem form()
    {
        return loonSystemRepo.findById(1L).orElse(null);
    }

    @PutMapping("")
    public LoonSystem modify(LoonSystem loonSystem, @RequestParam boolean rescan, @RequestParam boolean clearLibrary,
                             @RequestParam boolean deleteLibrary)
    {
        // if music folder has changed, clear library before re-scanning
        LoonSystem loonSystemFromDb = loonSystemRepo.findById(1L).orElse(null);
        if (loonSystemFromDb != null && !loonSystemFromDb.getMusicFolder().equals(loonSystem.getMusicFolder()))
            clearLibrary = true;

        loonSystem.setId(1L);
        loonSystem = loonSystemRepo.save(loonSystem);

        if (clearLibrary)
            clearLibrary();
        if (deleteLibrary)
            deleteLibrary();

        if (rescan)
            new Thread(musicScanner::scan).start();

        directoryWatcher.watch();

        return loonSystem;
    }

    @GetMapping("/imageScan")
    public String imageScan()
    {
        new Thread(imageScanner::scan).start();
        return "";
    }

    @GetMapping("/transcodeLibrary")
    public String transcodeLibrary()
    {
        int q = Integer.valueOf(loonSystemRepo.findById(1L).orElse(null).getTranscodeQuality());

        new Thread(() -> transcoderTask.run(trackRepo.findAll(), q)).start();
        return "";
    }

    @GetMapping("/getScanProgress/{key}")
    public ProgressTracker.ProgressStatus getScanProgress(@PathVariable String key)
    {
        ProgressTracker.ProgressStatus progressStatus = ProgressTracker.progressStatusMap.get(key);
        if (progressStatus == null)
            progressStatus = new ProgressTracker.ProgressStatus(0, "n/a");

        return progressStatus;
    }

    private void clearLibrary()
    {
        log.info("Clearing library...");
        List<Track> tracks = trackRepo.findAll();
        tracks.forEach(track -> track.setMissingFile(true));
        trackRepo.saveAll(tracks);
        log.info("Done clearing library...");
    }

    private void deleteLibrary()
    {
        log.info("Deleting library...");
        trackRepo.deleteAll();
        log.info("Done deleting library...");
    }
}
