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

    @GetMapping("/currentUserState")
    public UserState getCurrentUserState(@AuthenticationPrincipal User user)
    {
        // check that the user's last played track still exists
        Track track = trackRepo.findById(user.getUserState().getSelectedTrackId()).orElse(null);

        boolean playlistTrackMissing = false;
        if (user.getUserState().getSelectedPlaylistId() != 0)
        {
            PlaylistTrack playlistTrack = playlistTrackRepo.findByPlaylistIdAndTrackId(
                    user.getUserState().getSelectedPlaylistId(), user.getUserState().getSelectedTrackId());
            playlistTrackMissing = playlistTrack == null;
        }

        if (track == null || playlistTrackMissing)
        {
            user.getUserState().setSelectedPlaylistId(0L);

            Track firstTrack = trackRepo.findTopByOrderById().orElse(null);
            user.getUserState().setSelectedTrackId(firstTrack != null ? firstTrack.getId() : "");
            userRepo.save(user);
        }

        return user.getUserState();
    }

    @PutMapping("/{id}/saveProgress")
    public User modify(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestParam Long selectedPlaylistId, @RequestParam String selectedTrackId)
    {
        if (!user.getId().equals(id))
            return null;

        UserState userState = user.getUserState();
        userState.setSelectedPlaylistId(selectedPlaylistId);
        userState.setSelectedTrackId(selectedTrackId);
        return userRepo.save(user);
    }
    
    @PutMapping("/{id}")
    public User modify(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestParam Optional<Double> volume,
                       @RequestParam Optional<Boolean> shuffle, @RequestParam Optional<Boolean> muted,
                       @RequestParam Optional<Boolean> transcode, @RequestParam Optional<Integer> eqNum,
                       @RequestParam Optional<String> eqField, @RequestParam Optional<Integer> eqValue)
    {
        if (!user.getId().equals(id))
            return null;

        volume.ifPresent(aDouble -> user.getUserState().setVolume(aDouble));
        shuffle.ifPresent(aBoolean -> user.getUserState().setShuffle(aBoolean));
        muted.ifPresent(aBoolean -> user.getUserState().setMuted(aBoolean));
        transcode.ifPresent(aBoolean -> user.getUserState().setTranscode(aBoolean));
        if (eqNum.isPresent() && eqField.isPresent() && eqValue.isPresent()) {
            if (eqField.get().equals("Frequency")) {
                if (eqNum.get().equals(1)) user.getUserState().setEq1Frequency(eqValue.get());
                if (eqNum.get().equals(2)) user.getUserState().setEq2Frequency(eqValue.get());
                if (eqNum.get().equals(3)) user.getUserState().setEq3Frequency(eqValue.get());
                if (eqNum.get().equals(4)) user.getUserState().setEq4Frequency(eqValue.get());
            }
            if (eqField.get().equals("Gain")) {
                if (eqNum.get().equals(1)) user.getUserState().setEq1Gain(eqValue.get());
                if (eqNum.get().equals(2)) user.getUserState().setEq2Gain(eqValue.get());
                if (eqNum.get().equals(3)) user.getUserState().setEq3Gain(eqValue.get());
                if (eqNum.get().equals(4)) user.getUserState().setEq4Gain(eqValue.get());
            }
        }

        return userRepo.save(user);
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

    @PutMapping("/{id}/toggleDarkTheme")
    public User toggleDarkTheme(@AuthenticationPrincipal User user, @PathVariable Long id)
    {
        if (!user.getId().equals(id))
            return null;

        user.getUserState().setTheme(user.getUserState().getTheme().equals("default") ? "cyborg" : "default");

        return userRepo.save(user);
    }
}
