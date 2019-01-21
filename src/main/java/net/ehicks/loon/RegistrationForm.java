package net.ehicks.loon;

import net.ehicks.loon.beans.User;
import org.springframework.security.crypto.password.PasswordEncoder;

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

    public User toUser(PasswordEncoder passwordEncoder)
    {
        return new User(username, passwordEncoder.encode(password), fullname);
    }
}