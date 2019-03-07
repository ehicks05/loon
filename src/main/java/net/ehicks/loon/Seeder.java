package net.ehicks.loon;

import net.ehicks.loon.beans.*;
import net.ehicks.loon.repos.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

@Configuration
public class Seeder
{
    private static final Logger log = LoggerFactory.getLogger(Seeder.class);
    private UserRepository userRepo;
    private RoleRepository roleRepo;
    private PasswordEncoder passwordEncoder;
    private LoonSystemRepository loonSystemRepo;
    private UserLogic userLogic;

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
                Arrays.asList("admin@test.com", "password", "Admin"),
                Arrays.asList("user@test.com", "password", "User")
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
