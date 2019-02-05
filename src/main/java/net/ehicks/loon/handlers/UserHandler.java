package net.ehicks.loon.handlers;

import net.ehicks.loon.beans.User;
import net.ehicks.loon.beans.UserState;
import net.ehicks.loon.repos.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserHandler
{
    private static final Logger log = LoggerFactory.getLogger(UserHandler.class);
    private UserRepository userRepo;
    private PasswordEncoder passwordEncoder;

    public UserHandler(UserRepository userRepo, PasswordEncoder passwordEncoder)
    {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/whoami")
    public Long whoAmI(@AuthenticationPrincipal User user)
    {
        return user.getId();
    }

    @GetMapping("/{id}")
    public User form(@AuthenticationPrincipal User user, @PathVariable Long id)
    {
        if (!user.getId().equals(id))
            return null;
        return user;
    }

    @PutMapping("/{id}/saveProgress")
    public User modify(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestParam Long lastPlaylistId, @RequestParam Long lastTrackId)
    {
        if (!user.getId().equals(id))
            return null;

        UserState userState = user.getUserState();
        userState.setLastPlaylistId(lastPlaylistId);
        userState.setLastTrackId(lastTrackId);
        user = userRepo.save(user);

        return user;
    }
    
    @PutMapping("/{id}")
    public User modify(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestParam Optional<Double> volume, @RequestParam Optional<Boolean> shuffle)
    {
        if (!user.getId().equals(id))
            return null;

        if (volume.isPresent())
            user.getUserState().setVolume(volume.get());
        if (shuffle.isPresent())
            user.getUserState().setShuffle(shuffle.get());

        user = userRepo.save(user);
        return user;
    }

    @GetMapping("/{id}/changePassword")
    public User changePassword(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestParam String password)
    {
        if (!user.getId().equals(id))
            return null;

        if (!password.isEmpty())
        {
            user.setPassword(passwordEncoder.encode(password));
            userRepo.save(user);
        }

        return user;
    }
}
