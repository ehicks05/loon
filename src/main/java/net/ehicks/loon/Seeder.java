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
    private UserStateRepository userStateRepo;
    private RoleRepository roleRepo;
    private TrackRepository trackRepo;
    private PlaylistRepository playlistRepo;
    private PlaylistTrackRepository playlistTrackRepo;
    private PasswordEncoder passwordEncoder;
    private LoonSystemRepository loonSystemRepo;
    private PlaylistLogic playlistLogic;

    public Seeder(UserRepository userRepo, UserStateRepository userStateRepo, RoleRepository roleRepo, TrackRepository trackRepo, PlaylistRepository playlistRepo,
                  PlaylistTrackRepository playlistTrackRepo, PasswordEncoder passwordEncoder, LoonSystemRepository loonSystemRepo,
                  PlaylistLogic playlistLogic)
    {
        this.userRepo = userRepo;
        this.userStateRepo = userStateRepo;
        this.roleRepo = roleRepo;
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

        loonSystemRepo.deleteAll();
        
        LoonSystem loonSystem = new LoonSystem();
        loonSystem.setId(1L);
        loonSystem.setInstanceName("Loon");
        loonSystem.setLogonMessage("Welcome to Loon.");
        loonSystem.setTheme("default");
        loonSystem.setMusicFolder("c:/k/music");
        loonSystem.setRegistrationEnabled(false);
        loonSystem.setTranscodeQuality("default");
        loonSystemRepo.save(loonSystem);
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

        List<List<String>> users = Arrays.asList(
                Arrays.asList("admin@test.com", "password", "Admin"),
                Arrays.asList("user@test.com", "password", "User")
        );

        users.forEach((userData) -> {
            RegistrationForm registrationForm = new RegistrationForm(userData.get(0), userData.get(1), userData.get(2));
            Set<Role> roles = new HashSet<>(Set.of(roleRepo.findByRole("ROLE_USER")));
            if (userData.get(0).contains("admin"))
                roles.add(roleRepo.findByRole("ROLE_ADMIN"));

            User user = registrationForm.toUser(passwordEncoder, roles);

            UserState userState = new UserState();
            userState.setUser(user);
//            userState.setLastPlaylistId(0L);
//            userState.setLastTrackId(1L);

            user.setUserState(userState);

            userRepo.save(user);
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
            playlistTrack.setPlaylist(playlist);
            playlistTrack.setTrack(trackRepo.findById(selectedTrackId).orElse(null));
            playlistTrack.setIndex(playlistLogic.getNextAvailableIndex(playlist.getId()));
            playlistTrackRepo.save(playlistTrack);
        }
    }
}
