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

    void createDemoData()
    {
        createLoonSystem();
        createUsers();
        createPlaylists();
    }

    public void createLoonSystem()
    {
        LoonSystem loonSystem = new LoonSystem();
        loonSystem.setInstanceName("Loon of Bridgewater");
        loonSystem.setLogonMessage("<span>Welcome to Loon.</span>");
        loonSystem.setTheme("default");
        loonSystem.setMusicFolder("c:/k/music");
        loonSystem = loonSystemRepo.save(loonSystem);
    }

    public void createUsers()
    {
        Map<String, List<String>> users = new LinkedHashMap<>();
        users.put("eric@test.com", new ArrayList<>(Arrays.asList("eric", "Eric Tester")));
        users.put("steve@test.com", new ArrayList<>(Arrays.asList("steve", "Steve Tester")));
        users.put("tupac@test.com", new ArrayList<>(Arrays.asList("tupac", "2 Pac")));

        users.forEach((key, value) -> {
            RegistrationForm registrationForm = new RegistrationForm(key, value.get(0), value.get(1));
            userRepo.save(registrationForm.toUser(passwordEncoder));
        });
    }

    public void createPlaylists()
    {
        Random r = new Random();

        List<Track> tracks = trackRepo.findAll();

        for (User user : userRepo.findAll())
        {
            List<String> playlistNames = Arrays.asList("Driving Songs", "Rockin Tunes", "Classics");

            playlistNames.forEach(playlistName -> {
                Playlist playlist = new Playlist();
                playlist.setUserId(user.getId());
                playlist.setName(playlistName);

                playlist = playlistRepo.save(playlist);

                List<Long> selectedTrackIds = new ArrayList<>();

                int tries = 0;
                while (tries < 10)
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
            });
        }
    }
}
