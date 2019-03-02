package net.ehicks.loon.handlers;

import net.ehicks.loon.MultipartFileSender;
import net.ehicks.loon.Transcoder;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private TrackRepository trackRepo;
    private MyResourceHttpRequestHandler handler;
    private Transcoder transcoder;
    private LoonSystemRepository loonSystemRepo;

    public MediaController(TrackRepository trackRepo, MyResourceHttpRequestHandler handler, Transcoder transcoder,
                           LoonSystemRepository loonSystemRepo)
    {
        this.trackRepo = trackRepo;
        this.handler = handler;
        this.transcoder = transcoder;
        this.loonSystemRepo = loonSystemRepo;
    }

    @GetMapping("/media")
    protected void getMedia(HttpServletRequest request, HttpServletResponse response, @RequestParam Long id)
    {
        LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
        Track track = trackRepo.findById(id).orElse(null);
        if (track == null)
            return;

        try
        {
            Path output;

            if (!loonSystem.getTranscodeQuality().equals("default"))
            {
                Path transcodedFile = Paths.get(loonSystem.getTranscodeFolder())
                        .resolve(loonSystem.getTranscodeQuality())
                        .resolve(track.getMusicBrainzTrackId() + ".mp3");

                if (!transcodedFile.toFile().exists())
                    transcoder.transcode(track, Integer.valueOf(loonSystem.getTranscodeQuality()));
                output = transcodedFile;
            }
            else
                output = Paths.get(track.getPath());

            MultipartFileSender.fromPath(output)
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
