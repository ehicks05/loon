package net.ehicks.loon;

import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.TrackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.file.Paths;

@Controller
public class MediaController
{
    private static final Logger log = LoggerFactory.getLogger(MediaController.class);

    private TrackRepository trackRepo;

    public MediaController(TrackRepository trackRepo)
    {
        this.trackRepo = trackRepo;
    }

    @GetMapping("/media")
    protected void getMedia(HttpServletRequest request, HttpServletResponse response, @RequestParam Long id)
    {
        // Set standard HTTP/1.1 no-cache headers.
//        response.setHeader("Cache-Control", "private, no-store, no-cache, must-revalidate");

        Track track = trackRepo.findById(id).orElse(null);
        if (track != null)
        {
            try
            {
                // works but no seeking:
//                byte[] bytes = Files.readAllBytes(Paths.get(track.getPath()));
//                response.getOutputStream().write(bytes);

                MultipartFileSender.fromPath(Paths.get(track.getPath()))
                        .with(request)
                        .with(response)
                        .serveResource();
            }
            catch (Exception e)
            {
                log.error(e.getMessage(), e);
            }
        }
    }
}
