package net.ehicks.loon.handlers.admin;

import com.google.gson.Gson;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.MusicScanner;
import net.ehicks.loon.ProgressTracker;
import net.ehicks.loon.beans.LoonSystem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminHandler
{
    private static final Logger log = LoggerFactory.getLogger(AdminHandler.class);
    private LoonSystemRepository loonSystemRepo;
    private MusicScanner musicScanner;

    public AdminHandler(LoonSystemRepository loonSystemRepo, MusicScanner musicScanner)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.musicScanner = musicScanner;
    }

    @GetMapping("/systemSettings/form")
    public LoonSystem form()
    {
        return loonSystemRepo.findById(1L).orElse(null);
    }

    @PostMapping("/systemSettings/modify")
    public LoonSystem modify(LoonSystem loonSystem, @RequestParam boolean rescan)
    {
        if (rescan)
            new Thread(musicScanner::scan).start();

        return loonSystemRepo.save(loonSystem);
    }

    @GetMapping("/systemSettings/getScanProgress")
    public String getScanProgress()
    {
        ProgressTracker.ProgressStatus progressStatus = ProgressTracker.progressStatusMap.get("scanProgress");
        if (progressStatus == null)
            progressStatus = new ProgressTracker.ProgressStatus(0, "unknown");

        return new Gson().toJson(progressStatus);
    }
}
