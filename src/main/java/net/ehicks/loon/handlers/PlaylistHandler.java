package net.ehicks.loon.handlers;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializer;
import net.ehicks.loon.LibraryLogic;
import net.ehicks.loon.PlaylistLogic;
import net.ehicks.loon.PlaylistSerializer;
import net.ehicks.loon.beans.Playlist;
import net.ehicks.loon.beans.PlaylistTrack;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.beans.User;
import net.ehicks.loon.repos.PlaylistRepository;
import net.ehicks.loon.repos.PlaylistTrackRepository;
import net.ehicks.loon.repos.TrackRepository;
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
    private TrackRepository trackRepo;
    private PlaylistTrackRepository playlistTrackRepo;
    private LibraryLogic libraryLogic;
    private PlaylistLogic playlistLogic;
    private PlaylistSerializer playlistSerializer;

    public PlaylistHandler(PlaylistRepository playlistRepo, TrackRepository trackRepo, PlaylistTrackRepository playlistTrackRepo,
                           LibraryLogic libraryLogic, PlaylistLogic playlistLogic, PlaylistSerializer playlistSerializer)
    {
        this.playlistRepo = playlistRepo;
        this.trackRepo = trackRepo;
        this.playlistTrackRepo = playlistTrackRepo;
        this.libraryLogic = libraryLogic;
        this.playlistLogic = playlistLogic;
        this.playlistSerializer = playlistSerializer;
    }

    @GetMapping("/form")
    public String form(@AuthenticationPrincipal User user)
    {
        GsonBuilder gsonBuilder = new GsonBuilder();

        JsonSerializer<Playlist> playlistSerializer = (src, typeOfSrc, context) -> {

            long size = playlistTrackRepo.findByPlaylistIdOrderByIndex(src.getId()).size();

            JsonObject jsonPlaylist = new JsonObject();

            jsonPlaylist.addProperty("id", src.getId());
            jsonPlaylist.addProperty("userId", src.getUserId());
            jsonPlaylist.addProperty("name", src.getName());
            jsonPlaylist.addProperty("size", size);

            return jsonPlaylist;
        };

        gsonBuilder.registerTypeAdapter(Playlist.class, playlistSerializer);

        return gsonBuilder.create().toJson(playlistRepo.findByUserId(user.getId()));
    }

    @GetMapping("/getPlaylists")
    public List<Playlist> getPlaylists(@AuthenticationPrincipal User user)
    {
        return playlistRepo.findByUserId(user.getId());
    }

    @GetMapping("/getPlaylist")
    public Playlist getPlaylist(@RequestParam long playlistId)
    {
        return playlistRepo.findById(playlistId).orElse(null);
    }

    @GetMapping("/getLibraryTrackPaths")
    public String getLibraryTrackPaths()
    {
        return libraryLogic.getLibraryPathsJson();
    }

    @GetMapping("/ajaxGetInitialTracks")
    public List<Track> ajaxGetInitialTracks(@RequestParam long playlistId)
    {
        Playlist playlist = playlistRepo.findById(playlistId).orElse(null);
        return playlist.getPlaylistTracks().stream().map(PlaylistTrack::getTrack).collect(Collectors.toList());
    }

    @PostMapping("/addOrModify")
    public Playlist add(@AuthenticationPrincipal User user, @RequestParam long playlistId, @RequestParam String action,
                      @RequestParam String name, @RequestParam List<Long> trackIds)
    {
        Playlist playlist = playlistRepo.findById(playlistId).orElse(null);

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
            playlistLogic.setTrackIds(playlist, trackIds);
        }

        return playlist;
    }

    @PostMapping("/toggleFavorite")
    public Playlist add(@AuthenticationPrincipal User user, @RequestParam Long trackId)
    {
        Playlist playlist = playlistRepo.findByUserIdAndFavoritesTrue(user.getId());

        if (playlist != null)
            playlistLogic.addOrRemoveTrack(playlist, trackId);

        return playlist;
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity delete(@AuthenticationPrincipal User user, @PathVariable long playlistId)
    {
        Playlist playlist = playlistRepo.findById(playlistId).orElse(null);
        if (playlist != null && !playlist.getFavorites() && !playlist.getQueue())
        {
            playlistLogic.setTrackIds(playlist, new ArrayList<>());
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
