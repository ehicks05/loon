package net.ehicks.loon.handlers;

import net.ehicks.loon.beans.PlaylistTrack;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.beans.User;
import net.ehicks.loon.beans.UserState;
import net.ehicks.loon.repos.PlaylistTrackRepository;
import net.ehicks.loon.repos.TrackRepository;
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
    private TrackRepository trackRepo;
    private PlaylistTrackRepository playlistTrackRepo;

    public UserHandler(UserRepository userRepo, PasswordEncoder passwordEncoder, TrackRepository trackRepo,
                       PlaylistTrackRepository playlistTrackRepo)
    {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.trackRepo = trackRepo;
        this.playlistTrackRepo = playlistTrackRepo;
    }

    @GetMapping("/current")
    public User getCurrentUser(@AuthenticationPrincipal User user)
    {
        // check that the user's last played track still exists
        Track track = trackRepo.findById(user.getUserState().getLastTrackId()).orElse(null);

        boolean playlistTrackMissing = false;
        if (user.getUserState().getLastPlaylistId() != 0)
        {
            PlaylistTrack playlistTrack = playlistTrackRepo.findByPlaylistIdAndTrackId(user.getUserState().getLastPlaylistId(), user.getUserState().getLastTrackId());
            playlistTrackMissing = playlistTrack == null;
        }

        if (track == null || playlistTrackMissing)
        {
            user.getUserState().setLastPlaylistId(0L);

            Track firstTrack = trackRepo.findTopByOrderById().orElse(null);
            user.getUserState().setLastTrackId(firstTrack != null ? firstTrack.getId() : "");
            userRepo.save(user);
        }

        return user;
    }

    @PutMapping("/{id}/saveProgress")
    public User modify(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestParam Long lastPlaylistId, @RequestParam String lastTrackId)
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
    public User modify(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestParam Optional<Double> volume,
                       @RequestParam Optional<Boolean> shuffle, @RequestParam Optional<Boolean> muted)
    {
        if (!user.getId().equals(id))
            return null;

        if (volume.isPresent())
            user.getUserState().setVolume(volume.get());
        if (shuffle.isPresent())
            user.getUserState().setShuffle(shuffle.get());
        if (muted.isPresent())
            user.getUserState().setMuted(muted.get());

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

    @PutMapping("/{id}/eq")
    public User changeEq(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestParam Integer eqNum,
                         @RequestParam String field, @RequestParam Integer value)
    {
        if (!user.getId().equals(id))
            return null;

        if (field.equals("Frequency"))
        {
            if (eqNum.equals(1)) user.getUserState().setEq1Frequency(value);
            if (eqNum.equals(2)) user.getUserState().setEq2Frequency(value);
            if (eqNum.equals(3)) user.getUserState().setEq3Frequency(value);
            if (eqNum.equals(4)) user.getUserState().setEq4Frequency(value);
        }
        if (field.equals("Gain"))
        {
            if (eqNum.equals(1)) user.getUserState().setEq1Gain(value);
            if (eqNum.equals(2)) user.getUserState().setEq2Gain(value);
            if (eqNum.equals(3)) user.getUserState().setEq3Gain(value);
            if (eqNum.equals(4)) user.getUserState().setEq4Gain(value);
        }

        userRepo.save(user);
        return user;
    }
}
