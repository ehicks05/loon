package net.ehicks.loon;

import net.ehicks.loon.beans.Playlist;
import net.ehicks.loon.beans.User;
import net.ehicks.loon.repos.PlaylistRepository;
import org.springframework.stereotype.Service;

@Service
public class UserLogic
{
    private PlaylistRepository playlistRepo;

    public UserLogic(PlaylistRepository playlistRepo)
    {
        this.playlistRepo = playlistRepo;
    }

    public void createDefaultPlaylists(User user)
    {
        // set up 'special' playlists
        Playlist favorites = new Playlist();
        favorites.setUserId(user.getId());
        favorites.setName("Favorites");
        favorites.setFavorites(true);
        playlistRepo.save(favorites);

        Playlist queue = new Playlist();
        queue.setUserId(user.getId());
        queue.setName("Queue");
        queue.setQueue(true);
        playlistRepo.save(queue);
    }
}
