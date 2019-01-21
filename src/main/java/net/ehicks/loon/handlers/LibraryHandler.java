package net.ehicks.loon.handlers;

import net.ehicks.loon.beans.DBFile;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.beans.User;
import net.ehicks.loon.repos.DbFileRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/library")
public class LibraryHandler
{
    private DbFileRepository dbFileRepo;
    private TrackRepository trackRepo;

    public LibraryHandler(DbFileRepository dbFileRepo, TrackRepository trackRepo)
    {
        this.dbFileRepo = dbFileRepo;
        this.trackRepo = trackRepo;
    }

    @GetMapping("/ajaxGetInitialTracks")
    public List<Track> ajaxGetInitialTracks()
    {
        int from = 0;
        int amount = 10000;
        return getTracks(from, amount);
    }

    @GetMapping("/ajaxGetMoreTracks")
    public String ajaxGetMoreTracks(@RequestParam Integer from, @RequestParam Integer amount)
    {
//        request.setAttribute("from", from);
//        request.setAttribute("library", getTracks(from, amount));
//        request.setAttribute("haveMore", isHaveMore(from + amount));
        // todo
        return "";
    }

    @GetMapping("/ajaxGetImage")
    public byte[] ajaxGetImage(@RequestParam Long dbFileId)
    {
        DBFile dbFile = dbFileRepo.getOne(dbFileId);
        if (dbFile != null)
        {
            byte[] content = dbFile.getContent();
            if (content != null)
            {
                return content;
            }
        }

        return new byte[0];
    }

    @GetMapping("/ajaxGetIsAdmin")
    public String ajaxGetIsAdmin(@AuthenticationPrincipal User user)
    {
        return "true";
    }

    private List<Track> getTracks(int from, int amount)
    {
        List<Track> library = trackRepo.findAll();
        if (library.size() >= from + amount)
            library = library.subList(from, from + amount);
        return library;
    }

    private boolean isHaveMore(int n)
    {
        return trackRepo.count() > n;
    }
}
