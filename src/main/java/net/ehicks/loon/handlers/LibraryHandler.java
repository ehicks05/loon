package net.ehicks.loon.handlers;

import net.ehicks.loon.LibraryLogic;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.TrackRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/library")
public class LibraryHandler
{
    private TrackRepository trackRepo;
    private LibraryLogic libraryLogic;

    public LibraryHandler(TrackRepository trackRepo, LibraryLogic libraryLogic)
    {
        this.trackRepo = trackRepo;
        this.libraryLogic = libraryLogic;
    }

    @GetMapping("")
    public List<Track> getTracks()
    {
        return trackRepo.findAllByOrderByArtistAscAlbumAscTitleAsc();
    }

    @GetMapping("/getLibraryTrackPaths")
    public String getLibraryTrackPaths()
    {
        return libraryLogic.getLibraryPathsJson();
    }
}
