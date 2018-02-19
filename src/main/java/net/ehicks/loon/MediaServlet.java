package net.ehicks.loon;

import net.ehicks.common.Common;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.util.CommonIO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Date;

@WebServlet(value = "/media", loadOnStartup = 2)
public class MediaServlet extends HttpServlet
{
    private static final Logger log = LoggerFactory.getLogger(MediaServlet.class);

    @Override
    public void init()
    {
        log.info("MediaServlet starting...");
    }

    @Override
    public void destroy()
    {
        log.info("MediaServlet shutting down...");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        doPost(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        UserSession userSession = (UserSession) request.getSession(false).getAttribute("userSession");

        userSession.setLastActivity(new Date());
        userSession.setEnteredController(System.currentTimeMillis());

        // Set standard HTTP/1.1 no-cache headers.
        response.setHeader("Cache-Control", "private, no-store, no-cache, must-revalidate");

        Long id = Common.stringToLong(request.getParameter("id"));

        Track track = Track.getById(id);
        if (track != null)
        {
            try
            {
//                File outputFile = new File(track.getPath());
//                CommonIO.sendFileInResponse(response, outputFile, true);

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
