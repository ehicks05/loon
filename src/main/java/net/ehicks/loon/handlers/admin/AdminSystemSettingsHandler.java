package net.ehicks.loon.handlers.admin;

import com.google.gson.Gson;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.MusicScanner;
import net.ehicks.loon.ProgressTracker;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.repos.PlaylistRepository;
import net.ehicks.loon.repos.PlaylistTrackRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/systemSettings")
public class AdminSystemSettingsHandler
{
    private static final Logger log = LoggerFactory.getLogger(AdminSystemSettingsHandler.class);
    private LoonSystemRepository loonSystemRepo;
    private MusicScanner musicScanner;
    private TrackRepository trackRepo;
    private PlaylistRepository playlistRepo;
    private PlaylistTrackRepository playlistTrackRepo;

    public AdminSystemSettingsHandler(LoonSystemRepository loonSystemRepo, MusicScanner musicScanner, TrackRepository trackRepo,
                                      PlaylistRepository playlistRepo, PlaylistTrackRepository playlistTrackRepo)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.musicScanner = musicScanner;
        this.trackRepo = trackRepo;
        this.playlistRepo = playlistRepo;
        this.playlistTrackRepo = playlistTrackRepo;
    }

    @GetMapping("")
    public LoonSystem form()
    {
        return loonSystemRepo.findById(1L).orElse(null);
    }

    @PutMapping("")
    public LoonSystem modify(LoonSystem loonSystem, @RequestParam boolean rescan, @RequestParam boolean clearLibrary)
    {
        loonSystem.setId(1L);
        loonSystem = loonSystemRepo.save(loonSystem);

        if (clearLibrary)
            clearLibrary();

        if (rescan)
            new Thread(musicScanner::scan).start();

        return loonSystem;
    }

    @GetMapping("/getScanProgress")
    public String getScanProgress()
    {
        ProgressTracker.ProgressStatus progressStatus = ProgressTracker.progressStatusMap.get("scanProgress");
        if (progressStatus == null)
            progressStatus = new ProgressTracker.ProgressStatus(0, "unknown");

        return new Gson().toJson(progressStatus);
    }

    private void clearLibrary()
    {
        log.info("Clearing library...");
        trackRepo.deleteAll();
//        playlistRepo.deleteAll();
//        playlistTrackRepo.deleteAll();
        log.info("Done clearing library...");
    }
}
