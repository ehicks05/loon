package net.ehicks.loon;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Role;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.RoleRepository;
import net.ehicks.loon.repos.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.*;

@Controller
@RequestMapping("/register")
public class RegistrationController
{
    private UserRepository userRepo;
    private RoleRepository roleRepo;
    private LoonSystemRepository loonSystemRepo;
    private PasswordEncoder passwordEncoder;

    public RegistrationController(UserRepository userRepo, RoleRepository roleRepo, LoonSystemRepository loonSystemRepo,
                                  PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.loonSystemRepo = loonSystemRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @ModelAttribute("loonSystem")
    public LoonSystem loonSystem()
    {
        return loonSystemRepo.findById(1L).orElse(null);
    }

    @GetMapping
    public String registerForm() {
        return "registration";
    }

    @PostMapping
    public String processRegistration(RegistrationForm form) {
        Set<Role> roles = new HashSet<>(Arrays.asList(roleRepo.findByRole("ROLE_USER")));
        if (loonSystemRepo.findById(1L).orElse(null).isRegistrationEnabled())
            userRepo.save(form.toUser(passwordEncoder, roles));
        return "redirect:/login";
    }
}