package net.ehicks.loon.handlers.admin;

import net.ehicks.loon.SessionManager;
import net.ehicks.loon.beans.User;
import net.ehicks.loon.repos.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class UserHandler
{
    private static final Logger log = LoggerFactory.getLogger(AdminHandler.class);
    private UserRepository userRepo;
    private PasswordEncoder passwordEncoder;
    private SessionManager sessionManager;

    public UserHandler(UserRepository userRepo, PasswordEncoder passwordEncoder, SessionManager sessionManager)
    {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.sessionManager = sessionManager;
    }

    @GetMapping("/")
    public List<User> list()
    {
        return userRepo.findAll();
    }

    @DeleteMapping("/{username}")
    public String delete(@PathVariable String username)
    {
        User user = userRepo.findByUsername(username);
        if (user != null)
            userRepo.delete(user);

        return "";
    }

    @GetMapping("/{username}")
    public User form(@PathVariable String username)
    {
        return userRepo.findByUsername(username);
    }

    @PutMapping("/{username}")
    public User modify(@PathVariable String username, @RequestParam String newUsername, @RequestParam String fullName)
    {
        User user = userRepo.findByUsername(username);
        user.setUsername(newUsername);
        user.setFullName(fullName);
        user = userRepo.save(user);

        return user;
    }

    @GetMapping("/{username}/changePassword")
    public User changePassword(@PathVariable String username, @RequestParam String password)
    {
        User user = userRepo.findByUsername(username);

        if (!password.isEmpty())
        {
            user.setPassword(passwordEncoder.encode(password));
            userRepo.save(user);
        }

        return user;
    }

    @GetMapping("/activeSessions")
    public List<SessionInformation> activeSessions()
    {
        return sessionManager.getUsersFromSessionRegistry();
    }
}
