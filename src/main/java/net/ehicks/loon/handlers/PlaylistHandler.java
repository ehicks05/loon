package net.ehicks.loon.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializer;
import net.ehicks.loon.*;
import net.ehicks.loon.beans.Playlist;
import net.ehicks.loon.beans.PlaylistTrack;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.beans.User;
import net.ehicks.loon.repos.PlaylistRepository;
import net.ehicks.loon.repos.PlaylistTrackRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
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
    public String getPlaylists(@AuthenticationPrincipal User user)
    {
        GsonBuilder gsonBuilder = new GsonBuilder();

        gsonBuilder.registerTypeAdapter(Playlist.class, playlistSerializer);

        return gsonBuilder.create().toJson(playlistRepo.findByUserId(user.getId()));
    }

    @GetMapping("/getPlaylist")
    public String getPlaylist(@RequestParam long playlistId)
    {
        GsonBuilder gsonBuilder = new GsonBuilder();

        gsonBuilder.registerTypeAdapter(Playlist.class, playlistSerializer);

        return gsonBuilder.create().toJson(playlistRepo.findById(playlistId).orElse(null));
    }

    @GetMapping("/getLibraryTrackPaths")
    public String getLibraryTrackPaths()
    {
        return libraryLogic.getLibraryPathsJson();
    }

    @GetMapping("/ajaxGetInitialTracks")
    public String ajaxGetInitialTracks(@RequestParam long playlistId)
    {
        GsonBuilder gsonBuilder = new GsonBuilder();

        gsonBuilder.registerTypeAdapter(Track.class, new Track.Serializer());

        List<Track> trackList = playlistTrackRepo.findByPlaylistIdOrderByIndex(playlistId).stream()
                .map(playlistTrack -> trackRepo.findById(playlistTrack.getTrackId()).orElse(null))
                .collect(Collectors.toList());

        return gsonBuilder.create().toJson(trackList);
    }

    @PostMapping("/addOrModify")
    public String add(@AuthenticationPrincipal User user, @RequestParam long playlistId, @RequestParam String action,
                      @RequestParam String name, @RequestParam List<Long> trackIds)
    {
        GsonBuilder gsonBuilder = new GsonBuilder();

        gsonBuilder.registerTypeAdapter(Playlist.class, playlistSerializer);

        Gson gson = gsonBuilder.create();

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
            playlistLogic.setTrackIds(playlist.getId(), trackIds);
        }

        return gson.toJson(playlist);
    }

    @GetMapping("/delete")
    public String delete(@AuthenticationPrincipal User user, @RequestParam long playlistId)
    {
        GsonBuilder gsonBuilder = new GsonBuilder();

        gsonBuilder.registerTypeAdapter(Playlist.class, playlistSerializer);

        Gson gson = gsonBuilder.create();

        Playlist playlist = playlistRepo.getOne(playlistId);

        if (playlist != null)
        {
            // playlist must have an ID at this point
            playlistLogic.setTrackIds(playlist.getId(), Collections.EMPTY_LIST);

            playlistRepo.delete(playlist);
        }

        return gson.toJson(playlistRepo.findByUserId(user.getId()));
    }

    @PostMapping("/dragAndDrop")
    public String dragAndDrop(@AuthenticationPrincipal User user, @RequestParam long playlistId,
                              @RequestParam long oldIndex, @RequestParam long newIndex)
    {
        final long LOW = Math.min(oldIndex, newIndex);
        final long HIGH = Math.max(oldIndex, newIndex);

        // increment the index of all other tracks in the playlist with indexes >= to the new index and < the previous index.
        List<PlaylistTrack> playlistTracks = playlistTrackRepo.findByPlaylistIdOrderByIndex(playlistId);

        int adjustOthersBy = newIndex < oldIndex ? 1 : -1;

        playlistTracks.stream()
                .filter(playlistTrack -> playlistTrack.getIndex() >= LOW && playlistTrack.getIndex() <= HIGH)
                .forEach(track -> {
                    track.setIndex(track.getIndex() == oldIndex ? newIndex : track.getIndex() + adjustOthersBy);
                    playlistTrackRepo.save(track);
                });

        return "";
    }
}
