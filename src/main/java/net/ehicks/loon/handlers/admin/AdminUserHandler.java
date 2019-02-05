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
public class AdminUserHandler
{
    private static final Logger log = LoggerFactory.getLogger(AdminUserHandler.class);
    private UserRepository userRepo;
    private PasswordEncoder passwordEncoder;
    private SessionManager sessionManager;

    public AdminUserHandler(UserRepository userRepo, PasswordEncoder passwordEncoder, SessionManager sessionManager)
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

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id)
    {
        User user = userRepo.findById(id).orElse(null);
        if (user != null)
            userRepo.delete(user);

        return "";
    }

    @GetMapping("/{id}")
    public User form(@PathVariable Long id)
    {
        return userRepo.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public User modify(@PathVariable Long id, @RequestParam String newUsername, @RequestParam String fullName)
    {
        User user = userRepo.findById(id).orElse(null);
        user.setUsername(newUsername);
        user.setFullName(fullName);
        user = userRepo.save(user);

        return user;
    }

    @GetMapping("/{id}/changePassword")
    public User changePassword(@PathVariable Long id, @RequestParam String password)
    {
        User user = userRepo.findById(id).orElse(null);

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
