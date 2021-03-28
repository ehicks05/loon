package net.ehicks.loon.handlers;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.repos.LoonSystemRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SystemInfoController
{
    private LoonSystemRepository loonSystemRepo;

    public SystemInfoController(LoonSystemRepository loonSystemRepo)
    {
        this.loonSystemRepo = loonSystemRepo;
    }

    @RequestMapping("/admin/systemInfo")
    public LoonSystem getCommitId() {
        LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
        return loonSystem;
    }
}
