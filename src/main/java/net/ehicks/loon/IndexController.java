package net.ehicks.loon;

import net.ehicks.loon.repos.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class IndexController
{
    private UserRepository userRepo;
    private PasswordEncoder passwordEncoder;

    public IndexController(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public String showIndex() {
        return "index";
    }

//    @PostMapping
//    public String processRegistration(RegistrationForm form) {
//        userRepo.save(form.toUser(passwordEncoder));
//        return "redirect:/login";
//    }
}