package net.ehicks.loon.handlers;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/login")
public class LoginController
{
    private UserRepository userRepo;
    private LoonSystemRepository loonSystemRepo;
    private PasswordEncoder passwordEncoder;

    public LoginController(UserRepository userRepo, LoonSystemRepository loonSystemRepo,
                           PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.loonSystemRepo = loonSystemRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @ModelAttribute("loonSystem")
    public LoonSystem loonSystem()
    {
        return loonSystemRepo.findById(1L).orElse(null);
    }

    @GetMapping
    public String loginForm() {
        return "login";
    }
}