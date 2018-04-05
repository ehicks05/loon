package net.ehicks.loon;

import net.ehicks.loon.beans.*;
import net.ehicks.loon.util.PasswordUtil;
import net.ehicks.common.Timer;
import net.ehicks.eoi.EOI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class Seeder
{
    private static final Logger log = LoggerFactory.getLogger(Seeder.class);

    static void createDemoData()
    {
        log.info("Seeding dummy data");
        Timer timer = new Timer();

        // use in production
        createLoonSystem();
        log.debug(timer.printDuration("createLoonSystem"));

        createUsers();
        log.debug(timer.printDuration("createUsers"));

        createPlaylists();
        log.debug(timer.printDuration("createPlaylists"));

        log.info(timer.printDuration("Done seeding dummy data"));
    }

    private static void createLoonSystem()
    {
        LoonSystem loonSystem = LoonSystem.getSystem();
        if (loonSystem == null)
        {
            loonSystem = new LoonSystem();
            long id = EOI.insert(loonSystem, SystemTask.SEEDER);
            loonSystem = LoonSystem.getById(id);
        }
        loonSystem.setInstanceName("Loon of Bridgewater");
        loonSystem.setLogonMessage("<span>Welcome to Loon.</span>");
        loonSystem.setTheme("");
//        loonSystem.setMusicFolder("d:/music loon");
        loonSystem.setMusicFolder("c:/k/music");

        EOI.update(loonSystem, SystemTask.SEEDER);
    }

    private static void createUsers()
    {
        Map<String, List<String>> users = new LinkedHashMap<>();
        users.put("eric@test.com", new ArrayList<>(Arrays.asList("eric", "2", "Eric", "Tester")));
        users.put("steve@test.com", new ArrayList<>(Arrays.asList("steve", "15", "Steve", "Tester")));
        users.put("tupac@test.com", new ArrayList<>(Arrays.asList("tupac", "3", "2", "Pac")));

        for (String key : users.keySet())
        {
            User user = new User();
            user.setLogonId(key);

            String rawPassword = users.get(key).get(0);
            String password = PasswordUtil.digestPassword(rawPassword);

            user.setPassword(password);

            user.setFirstName(users.get(key).get(2));
            user.setLastName(users.get(key).get(3));
            user.setCreatedOn(new Date());
            user.setUpdatedOn(new Date());
            long userId = EOI.insert(user, SystemTask.SEEDER);

            Role role = new Role();
            role.setLogonId(user.getLogonId());
            role.setUserId(userId);
            role.setRoleName("user");
            EOI.insert(role, SystemTask.SEEDER);

            if (user.getLogonId().equals("eric@test.com"))
            {
                role.setRoleName("admin");
                EOI.insert(role, SystemTask.SEEDER);
            }
        }
    }

    private static void createPlaylists()
    {
        Random r = new Random();
        for (User user : User.getAll())
        {
            List<String> playlistNames = Arrays.asList("Driving Songs", "Rockin Tunes", "Classics");

            playlistNames.forEach(playlistName -> {
                Playlist playlist = new Playlist();
                playlist.setUserId(user.getId());
                playlist.setName(playlistName);
                Long playlistId = EOI.insert(playlist, SystemTask.SEEDER);

                List<Long> selectedTracks = new ArrayList<>();

                while (selectedTracks.size() < 5)
                {
                    int tries = 0;
                    Long random = (long) r.nextInt(100) + 1;
                    while (selectedTracks.contains(random) && tries < 10)
                    {
                        random = (long) r.nextInt(100) + 1;
                        tries++;
                    }
                    selectedTracks.add(random);
                }
                
                for (Long selectedTrackId : selectedTracks)
                {
                    PlaylistTrack playlistTrack = new PlaylistTrack();
                    playlistTrack.setPlaylistId(playlistId);
                    playlistTrack.setTrackId(selectedTrackId);
                    EOI.insert(playlistTrack, SystemTask.SEEDER);
                }
            });
        }
    }
}
