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
import java.io.File;
import java.nio.file.Paths;

@Controller
public class MediaController
{
    private static final Logger log = LoggerFactory.getLogger(MediaController.class);

    private TrackRepository trackRepo;
    private MyResourceHttpRequestHandler handler;

    public MediaController(TrackRepository trackRepo, MyResourceHttpRequestHandler handler)
    {
        this.trackRepo = trackRepo;
        this.handler = handler;
    }

    @GetMapping("/media")
    protected void getMedia(HttpServletRequest request, HttpServletResponse response, @RequestParam Long id)
    {
        Track track = trackRepo.findById(id).orElse(null);
        if (track != null)
        {
            try
            {
                MultipartFileSender.fromPath(Paths.get(track.getPath()))
                        .with(request)
                        .with(response)
                        .serveResource();

                // todo: ran into a range off-by-one error with this. would like to eventually remove MultipartFileSender.
//                request.setAttribute(MyResourceHttpRequestHandler.ATTR_FILE, new File(track.getPath()));
//                handler.handleRequest(request, response);

            }
            catch (Exception e)
            {
                log.error(e.getMessage());
            }
        }
    }
}
