package net.ehicks.loon.handlers;

import net.ehicks.loon.beans.DBFile;
import net.ehicks.loon.beans.Role;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.beans.User;
import net.ehicks.loon.repos.DbFileRepository;
import net.ehicks.loon.repos.RoleRepository;
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
    private RoleRepository roleRepo;

    public LibraryHandler(DbFileRepository dbFileRepo, TrackRepository trackRepo, RoleRepository roleRepo)
    {
        this.dbFileRepo = dbFileRepo;
        this.trackRepo = trackRepo;
        this.roleRepo = roleRepo;
    }

    @GetMapping("")
    public List<Track> getTracks()
    {
        return trackRepo.findAllByOrderByArtistAscAlbumAscTitleAsc();
    }

    @GetMapping("/ajaxGetImage")
    public byte[] ajaxGetImage(@RequestParam Long dbFileId)
    {
        DBFile dbFile = dbFileRepo.findById(dbFileId).orElse(null);
        if (dbFile != null && dbFile.getContent() != null)
            return dbFile.getContent();

        return new byte[0];
    }

    @GetMapping("/ajaxGetIsAdmin")
    public boolean ajaxGetIsAdmin(@AuthenticationPrincipal User user)
    {
        Role adminRole = roleRepo.findByRole("ROLE_ADMIN");
        return user.getAuthorities().contains(adminRole);
    }
}
