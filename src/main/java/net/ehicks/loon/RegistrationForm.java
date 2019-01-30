package net.ehicks.loon;

import net.ehicks.loon.beans.Role;
import net.ehicks.loon.beans.User;
import net.ehicks.loon.repos.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Set;

public class RegistrationForm
{
    private String username;
    private String password;
    private String fullname;

    public RegistrationForm(String username, String password, String fullname)
    {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
    }

    public User toUser(PasswordEncoder passwordEncoder, Set<Role> roles)
    {
        return new User(username, passwordEncoder.encode(password), fullname, roles);
    }
}