package net.ehicks.loon.handlers;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.beans.User;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class MediaController
{
    private static final Logger log = LoggerFactory.getLogger(MediaController.class);

    private final TrackRepository trackRepo;
    private final MyResourceHttpRequestHandler handler;
    private final LoonSystemRepository loonSystemRepo;

    public MediaController(TrackRepository trackRepo, MyResourceHttpRequestHandler handler,
                           LoonSystemRepository loonSystemRepo)
    {
        this.trackRepo = trackRepo;
        this.handler = handler;
        this.loonSystemRepo = loonSystemRepo;
    }

    @GetMapping("/media")
    protected void getMedia(@AuthenticationPrincipal User user, HttpServletRequest request,
                            HttpServletResponse response, @RequestParam String id)
    {
        LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
        Track track = trackRepo.findById(id).orElse(null);
        if (loonSystem == null || track == null)
            return;

        try
        {
            Path output;

            if (user.getUserState().isTranscode())
            {
                Path transcodedFile = Paths.get(loonSystem.getTranscodeFolder())
                        .resolve(loonSystem.getTranscodeQuality())
                        .resolve(track.getId() + ".mp3");

                output = transcodedFile.toFile().exists()
                        ? transcodedFile : Paths.get(track.getPath());
            }
            else
                output = Paths.get(track.getPath());

            request.setAttribute(MyResourceHttpRequestHandler.ATTR_FILE, output.toFile());
            handler.handleRequest(request, response);
        }
        catch (Exception e)
        {
            log.error(e.getMessage());
        }
    }
}
