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
    private TrackRepository trackRepo;
    private PlaylistRepository playlistRepo;
    private PlaylistTrackRepository playlistTrackRepo;
    private PasswordEncoder passwordEncoder;
    private LoonSystemRepository loonSystemRepo;
    private PlaylistLogic playlistLogic;

    public Seeder(UserRepository userRepo, TrackRepository trackRepo, PlaylistRepository playlistRepo,
                  PlaylistTrackRepository playlistTrackRepo, PasswordEncoder passwordEncoder, LoonSystemRepository loonSystemRepo,
                  PlaylistLogic playlistLogic)
    {
        this.userRepo = userRepo;
        this.trackRepo = trackRepo;
        this.playlistRepo = playlistRepo;
        this.playlistTrackRepo = playlistTrackRepo;
        this.passwordEncoder = passwordEncoder;
        this.loonSystemRepo = loonSystemRepo;
        this.playlistLogic = playlistLogic;
    }

    public void createLoonSystem()
    {
        if (loonSystemRepo.findById(1L).orElse(null) != null)
            return;

        LoonSystem loonSystem = new LoonSystem();
        loonSystem.setInstanceName("Loon");
        loonSystem.setLogonMessage("<span>Welcome to Loon.</span>");
        loonSystem.setTheme("default");
        loonSystem.setMusicFolder("c:/k/music");
        loonSystem.setRegistrationEnabled(false);
        loonSystem.setTranscodeQuality("default");
        loonSystemRepo.save(loonSystem);
    }

    public void createDefaultUsers()
    {
        if (userRepo.count() > 0)
            return;

        List<List<String>> users = Arrays.asList(
                Arrays.asList("admin", "password", "Admin"),
                Arrays.asList("user", "password", "User")
        );

        users.forEach((user) -> {
            RegistrationForm registrationForm = new RegistrationForm(user.get(0), user.get(1), user.get(2));
            userRepo.save(registrationForm.toUser(passwordEncoder));
        });
    }

    public void createRandomPlaylist(long userId)
    {
        int playlistSize = 10;
        List<Track> tracks = trackRepo.findAll();
        if (tracks.size() == 0)
            return;

        Random r = new Random();

        String playlistName = "Random Playlist";

        Playlist playlist = new Playlist();
        playlist.setUserId(userId);
        playlist.setName(playlistName);

        playlist = playlistRepo.save(playlist);

        List<Long> selectedTrackIds = new ArrayList<>();

        int tries = 0;
        while (tries < playlistSize)
        {
            int trackListIndex = r.nextInt(tracks.size());
            Long trackId = tracks.get(trackListIndex).getId();
            if (!selectedTrackIds.contains(trackId))
                selectedTrackIds.add(trackId);

            tries++;
        }

        for (Long selectedTrackId : selectedTrackIds)
        {
            PlaylistTrack playlistTrack = new PlaylistTrack();
            playlistTrack.setPlaylistId(playlist.getId());
            playlistTrack.setTrackId(selectedTrackId);
            playlistTrack.setIndex(playlistLogic.getNextAvailableIndex(playlist.getId()));
            playlistTrackRepo.save(playlistTrack);
        }
    }
}
