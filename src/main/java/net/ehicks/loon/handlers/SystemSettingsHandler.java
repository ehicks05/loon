package net.ehicks.loon.handlers;

import net.ehicks.loon.repos.LoonSystemRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/systemSettings")
public class SystemSettingsHandler
{
    private LoonSystemRepository loonSystemRepo;

    public SystemSettingsHandler(LoonSystemRepository loonSystemRepo)
    {
        this.loonSystemRepo = loonSystemRepo;
    }

    @GetMapping("/theme")
    public String getTheme()
    {
        return loonSystemRepo.findById(1L).orElse(null).getTheme();
    }
}
