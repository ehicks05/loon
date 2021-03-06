package net.ehicks.loon;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Role;
import net.ehicks.loon.beans.User;
import net.ehicks.loon.beans.UserState;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.RoleRepository;
import net.ehicks.loon.repos.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
public class Seeder
{
    private static final Logger log = LoggerFactory.getLogger(Seeder.class);
    private UserRepository userRepo;
    private RoleRepository roleRepo;
    private PasswordEncoder passwordEncoder;
    private LoonSystemRepository loonSystemRepo;
    private UserLogic userLogic;

    @Value("${admin_username}")
    private String adminUsername;

    @Value("${admin_password}")
    private String adminPassword;

    public Seeder(UserRepository userRepo, RoleRepository roleRepo, PasswordEncoder passwordEncoder,
                  LoonSystemRepository loonSystemRepo, UserLogic userLogic)
    {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
        this.loonSystemRepo = loonSystemRepo;
        this.userLogic = userLogic;
    }

    public void createLoonSystem()
    {
        if (loonSystemRepo.findById(1L).isPresent())
            return;

        loonSystemRepo.save(new LoonSystem());
    }

    public void createDefaultRoles()
    {
        if (roleRepo.count() > 0)
            return;

        Arrays.asList("ROLE_USER", "ROLE_ADMIN").forEach((r) -> {
            Role role = new Role();
            role.setRole(r);
            roleRepo.save(role);
        });
    }

    public void createDefaultUsers()
    {
        if (userRepo.count() > 0)
            return;

        List<List<String>> defaultUsers = Arrays.asList(
                Arrays.asList(adminUsername, adminPassword, "Admin")
        );

        defaultUsers.forEach((userData) -> {
            RegistrationForm registrationForm = new RegistrationForm(userData.get(0), userData.get(1), userData.get(2));
            Set<Role> roles = new HashSet<>(Set.of(roleRepo.findByRole("ROLE_USER")));
            if (userData.get(0).contains("admin"))
                roles.add(roleRepo.findByRole("ROLE_ADMIN"));

            User user = registrationForm.toUser(passwordEncoder, roles);

            UserState userState = new UserState();
            userState.setUser(user);

            user.setUserState(userState);

            user = userRepo.save(user);

            userLogic.createDefaultPlaylists(user);
        });
    }
}
