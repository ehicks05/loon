package net.ehicks.loon.handlers;

import com.google.gson.Gson;
import net.ehicks.common.Common;
import net.ehicks.loon.UserSession;
import net.ehicks.loon.beans.DBFile;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.routing.Route;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class LibraryHandler
{
    @Route(path = "library")
    public static String ajaxGetInitialTracks(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        String action = request.getParameter("action");
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        if (action.equals("ajaxGetInitialTracks"))
        {
            int from = 0;
            int amount = 10000;
            request.setAttribute("from", from);
            request.setAttribute("library", getTracks(from, amount));
            request.setAttribute("haveMore", isHaveMore(from + amount));

            Gson gson = new Gson();
            String tracks = gson.toJson(getTracks(from, amount));
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(tracks);
        }

        if (action.equals("ajaxGetMoreTracks"))
        {
            int from = Common.stringToInt(request.getParameter("from"));
            int amount = Common.stringToInt(request.getParameter("amount"));

            request.setAttribute("from", from);
            request.setAttribute("library", getTracks(from, amount));
            request.setAttribute("haveMore", isHaveMore(from + amount));
            // todo
        }

        if (action.equals("ajaxGetImage"))
        {
            Long dbFileId = Common.stringToLong(request.getParameter("dbFileId"));
            DBFile dbFile = DBFile.getById(dbFileId);
            if (dbFile != null)
            {
                byte[] content = dbFile.getContent();
                if (content != null)
                {
                    response.setContentType("image/jpeg");
                    response.getOutputStream().write(content);
                    return null;
                }
            }

            response.setContentType("image/jpeg");
            response.getOutputStream().write(new byte[0]);
        }

        if (action.equals("ajaxGetIsAdmin"))
        {
            Gson gson = new Gson();

            String jsonResponse = "";
            if (userSession.getUser().isAdmin())
            {
                jsonResponse = gson.toJson(userSession.getUser().isAdmin());
            }

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(jsonResponse);
        }

        return null;
    }

    private static List<Track> getTracks(int from, int amount)
    {
        List<Track> library = Track.getAll();
        if (library.size() >= from + amount)
            library = library.subList(from, from + amount);
        return library;
    }

    private static boolean isHaveMore(int n)
    {
        return Track.getAll().size() > n;
    }
}
