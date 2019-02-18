package net.ehicks.loon.handlers;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.repos.LoonSystemRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class IndexController
{
    private LoonSystemRepository loonSystemRepo;

    public IndexController(LoonSystemRepository loonSystemRepo) {
        this.loonSystemRepo = loonSystemRepo;
    }

    @ModelAttribute("loonSystem")
    public LoonSystem loonSystem()
    {
        return loonSystemRepo.findById(1L).orElse(null);
    }

    @GetMapping
    public String showIndex() {
        return "index";
    }
}