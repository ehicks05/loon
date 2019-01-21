package net.ehicks.loon.handlers.admin;

import net.ehicks.loon.repos.UserRepository;
import net.ehicks.loon.beans.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/api/admin/users")
public class UserHandler
{
    private static final Logger log = LoggerFactory.getLogger(AdminHandler.class);
    private UserRepository userRepo;
    private PasswordEncoder passwordEncoder;

    public UserHandler(UserRepository userRepo, PasswordEncoder passwordEncoder)
    {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/list")
    public String list()
    {
        Iterable<User> users = userRepo.findAll();
        return "";
    }

    @GetMapping("/create")
    public String create(@RequestParam String username)
    {
        User user = userRepo.findByUsername(username);
        if (user != null)
            userRepo.delete(user);

        return "redirect:/";
    }

    @GetMapping("/form")
    public String form(@RequestParam String username)
    {
        User user = userRepo.findByUsername(username);

        return "userview";
    }

    @GetMapping("/modify")
    public String modify(@RequestParam String username, @RequestParam String newUsername, @RequestParam String fullName)
    {
        User user = userRepo.findByUsername(username);
        user.setUsername(newUsername);
        user.setFullName(fullName);
        userRepo.save(user);

        return "userview";
    }

    @GetMapping("/changePassword")
    public String changePassword(@RequestParam String username, @RequestParam String password)
    {
        User user = userRepo.findByUsername(username);

        if (!password.isEmpty())
        {
            user.setPassword(passwordEncoder.encode(password));
            userRepo.save(user);
        }

        return "userview";
    }
}
