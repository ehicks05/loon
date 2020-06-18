package net.ehicks.loon.handlers.admin;

import net.ehicks.loon.RegistrationForm;
import net.ehicks.loon.SessionManager;
import net.ehicks.loon.UserLogic;
import net.ehicks.loon.beans.Role;
import net.ehicks.loon.beans.User;
import net.ehicks.loon.beans.UserState;
import net.ehicks.loon.repos.RoleRepository;
import net.ehicks.loon.repos.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserHandler
{
    private static final Logger log = LoggerFactory.getLogger(AdminUserHandler.class);
    private UserRepository userRepo;
    private RoleRepository roleRepo;
    private PasswordEncoder passwordEncoder;
    private SessionManager sessionManager;
    private UserLogic userLogic;

    public AdminUserHandler(UserRepository userRepo, RoleRepository roleRepo, PasswordEncoder passwordEncoder,
                            SessionManager sessionManager, UserLogic userLogic)
    {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
        this.sessionManager = sessionManager;
        this.userLogic = userLogic;
    }

    @GetMapping("")
    public List<User> list()
    {
        return userRepo.findAllByOrderById();
    }

    @DeleteMapping("/{id}")
    public String delete(@AuthenticationPrincipal User user, @PathVariable Long id)
    {
        User userToDelete = userRepo.findById(id).orElse(null);

        if (userToDelete == null || user.getId().equals(id))
            return "";
        
        userRepo.delete(userToDelete);

        return "";
    }

    @GetMapping("/{id}")
    public User form(@PathVariable Long id)
    {
        return userRepo.findById(id).orElse(null);
    }

    @PostMapping("")
    public User create(RegistrationForm registrationForm)
    {
        Set<Role> roles = new HashSet<>(Arrays.asList(roleRepo.findByRole("ROLE_USER")));

        User user = registrationForm.toUser(passwordEncoder, roles);
        UserState userState = new UserState();
        user.setUserState(userState);
        userState.setUser(user);

        user = userRepo.save(user);

        userLogic.createDefaultPlaylists(user);

        return user;
    }

    @PutMapping("/{id}")
    public User modify(@PathVariable Long id, @RequestParam String username, @RequestParam String password,
                       @RequestParam String fullName, @RequestParam Boolean isAdmin)
    {
        User user = userRepo.findById(id).orElse(null);
        if (user == null)
            return null;

        if (!username.isBlank())
            user.setUsername(username);

        if (!password.isBlank())
            user.setPassword(passwordEncoder.encode(password));

        if (!fullName.isBlank())
            user.setFullName(fullName);

        if (isAdmin != null)
        {
            Role adminRole = roleRepo.findByRole("ROLE_ADMIN");
            Set<Role> newRoles = user.getRoles();

            if (isAdmin) newRoles.add(adminRole);
            else newRoles.remove(adminRole);

            user.setRoles(newRoles);
        }

        return userRepo.save(user);
    }

    @GetMapping("/activeSessions")
    public List<SessionInformation> activeSessions()
    {
        return sessionManager.getUsersFromSessionRegistry();
    }
}
