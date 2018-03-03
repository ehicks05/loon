package net.ehicks.loon.handlers;

import net.ehicks.common.Common;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.routing.Route;
import net.ehicks.loon.UserSession;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.util.List;

public class LibraryHandler
{
    @Route(tab1 = "library", tab2 = "", tab3 = "", action = "form")
    public static String showDashboard(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        int from = 0;
        int amount = 100;
        request.setAttribute("library", getTracks(from, amount));
        request.setAttribute("haveMore", isHaveMore(from + amount));

        return "/webroot/library.jsp";
    }

    @Route(tab1 = "library", tab2 = "", tab3 = "", action = "ajaxGetMoreTracks")
    public static String ajaxGetMoreTracks(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        int from = Common.stringToInt(request.getParameter("from"));
        int amount = Common.stringToInt(request.getParameter("amount"));

        request.setAttribute("library", getTracks(from, amount));
        request.setAttribute("haveMore", isHaveMore(from + amount));

        return "/webroot/inc_libraryTracks.jsp";
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
