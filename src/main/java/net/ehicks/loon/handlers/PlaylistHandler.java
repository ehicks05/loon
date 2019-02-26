package net.ehicks.loon.handlers;

import net.ehicks.loon.LibraryLogic;
import net.ehicks.loon.PlaylistLogic;
import net.ehicks.loon.beans.Playlist;
import net.ehicks.loon.beans.PlaylistTrack;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.beans.User;
import net.ehicks.loon.repos.PlaylistRepository;
import net.ehicks.loon.repos.PlaylistTrackRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistHandler
{
    private PlaylistRepository playlistRepo;
    private PlaylistTrackRepository playlistTrackRepo;
    private LibraryLogic libraryLogic;
    private PlaylistLogic playlistLogic;

    public PlaylistHandler(PlaylistRepository playlistRepo, PlaylistTrackRepository playlistTrackRepo,
                           LibraryLogic libraryLogic, PlaylistLogic playlistLogic)
    {
        this.playlistRepo = playlistRepo;
        this.playlistTrackRepo = playlistTrackRepo;
        this.libraryLogic = libraryLogic;
        this.playlistLogic = playlistLogic;
    }

    @GetMapping("/getPlaylists")
    public List<Playlist> getPlaylists(@AuthenticationPrincipal User user)
    {
        return playlistRepo.findByUserId(user.getId());
    }

    @GetMapping("/{playlistId}")
    public Playlist getPlaylist(@AuthenticationPrincipal User user, @PathVariable Long playlistId)
    {
        Playlist playlist = playlistRepo.findById(playlistId).orElse(null);
        if (playlist == null || !playlist.getUserId().equals(user.getId()))
            return null;

        return playlist;
    }

    @GetMapping("/getLibraryTrackPaths")
    public String getLibraryTrackPaths()
    {
        return libraryLogic.getLibraryPathsJson();
    }

    @GetMapping("/ajaxGetInitialTracks")
    public List<Track> ajaxGetInitialTracks(@AuthenticationPrincipal User user, @RequestParam long playlistId)
    {
        Playlist playlist = playlistRepo.findById(playlistId).orElse(null);
        if (playlist == null || !playlist.getUserId().equals(user.getId()))
            return null;

        return playlist.getPlaylistTracks().stream().map(PlaylistTrack::getTrack).collect(Collectors.toList());
    }

    @PostMapping("/addOrModify")
    public Playlist add(@AuthenticationPrincipal User user, @RequestParam long playlistId, @RequestParam String action,
                      @RequestParam String name, @RequestParam List<Long> trackIds)
    {
        Playlist playlist = playlistRepo.findById(playlistId).orElse(null);
        if (playlist != null && !playlist.getUserId().equals(user.getId()))
            return null;

        if (playlist == null && action.equals("add") && name != null)
        {
            playlist = new Playlist();
            playlist.setUserId(user.getId());
        }

        if (playlist != null)
        {
            if (!name.isEmpty())
                playlist.setName(name);

            playlist = playlistRepo.save(playlist);

            // playlist must have an ID at this point
            playlistLogic.updatePlaylistTracks(playlist, trackIds, "add", true);
        }

        return playlist;
    }

    @PutMapping("/setTracks")
    public Playlist setTracks(@AuthenticationPrincipal User user, @RequestParam long playlistId, @RequestParam List<Long> trackIds)
    {
        Playlist playlist = playlistRepo.findById(playlistId).orElse(null);

        if (playlist != null && playlist.getUserId().equals(user.getId()))
            playlistLogic.updatePlaylistTracks(playlist, trackIds, "add", true);

        return playlist;
    }

    @PostMapping("/{playlistId}")
    public Playlist togglePlaylistTracks(@AuthenticationPrincipal User user, @PathVariable Long playlistId,
                                        @RequestParam List<Long> trackIds, @RequestParam String mode)
    {
        Playlist playlist = playlistRepo.findById(playlistId).orElse(null);

        if (playlist != null && playlist.getUserId().equals(user.getId()))
            playlistLogic.updatePlaylistTracks(playlist, trackIds, mode, false);

        return playlist;
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity delete(@AuthenticationPrincipal User user, @PathVariable long playlistId)
    {
        Playlist playlist = playlistRepo.findById(playlistId).orElse(null);
        if (playlist != null && playlist.getUserId().equals(user.getId()) && !playlist.getFavorites() && !playlist.getQueue())
        {
            playlistLogic.updatePlaylistTracks(playlist, new ArrayList<>(), "", true);
            playlistRepo.delete(playlist);
        }

        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/dragAndDrop")
    public String dragAndDrop(@AuthenticationPrincipal User user, @RequestParam long playlistId,
                              @RequestParam long oldIndex, @RequestParam long newIndex)
    {
        final long LOW = Math.min(oldIndex, newIndex);
        final long HIGH = Math.max(oldIndex, newIndex);
        Playlist playlist = playlistRepo.findById(playlistId).orElse(null);

        // increment the index of all other tracks in the playlist with indexes >= to the new index and < the previous index.
        Set<PlaylistTrack> playlistTracks = playlist.getPlaylistTracks();

        int adjustOthersBy = newIndex < oldIndex ? 1 : -1;

        playlistTracks.stream()
                .filter(playlistTrack -> playlistTrack.getIndex() >= LOW && playlistTrack.getIndex() <= HIGH)
                .forEach(track -> {
                    track.setIndex(track.getIndex() == oldIndex ? newIndex : track.getIndex() + adjustOthersBy);
                    playlistTrackRepo.save(track);
                });

        playlist.setPlaylistTracks(playlistTracks); // todo is this needed?

        return "";
    }
}
