package net.ehicks.loon.handlers;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.repos.LoonSystemRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/systemSettings")
public class SystemSettingsHandler {
    private LoonSystemRepository loonSystemRepo;

    public SystemSettingsHandler(LoonSystemRepository loonSystemRepo)
    {
        this.loonSystemRepo = loonSystemRepo;
    }

    // exists so we can show non-admins the quality setting
    @GetMapping("/transcodeQuality")
    public String getTranscodeQuality() {
        LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
        return loonSystem != null ? loonSystem.getTranscodeQuality() : "";
    }
}