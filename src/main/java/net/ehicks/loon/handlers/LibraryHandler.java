package net.ehicks.loon.handlers;

import com.google.gson.Gson;
import net.ehicks.common.Common;
import net.ehicks.loon.SystemInfo;
import net.ehicks.loon.SystemTask;
import net.ehicks.loon.beans.DBFile;
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
    public static String showDashboard(HttpServletRequest request, HttpServletResponse response)
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        int from = 0;
        int amount = 100;
        request.setAttribute("from", from);
        request.setAttribute("library", getTracks(from, amount));
        request.setAttribute("haveMore", isHaveMore(from + amount));

        return "/webroot/library.jsp";
    }

    @Route(tab1 = "library", tab2 = "", tab3 = "", action = "form2")
    public static String showDashboardHtml(HttpServletRequest request, HttpServletResponse response)
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        int from = 0;
        int amount = 100;
        request.setAttribute("from", from);
        request.setAttribute("library", getTracks(from, amount));
        request.setAttribute("haveMore", isHaveMore(from + amount));

        return "/webroot/index.html";
    }

    @Route(tab1 = "library", tab2 = "", tab3 = "", action = "ajaxGetInitialTracks")
    public static void ajaxGetInitialTracks(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        int from = 0;
        int amount = 10;
        request.setAttribute("from", from);
        request.setAttribute("library", getTracks(from, amount));
        request.setAttribute("haveMore", isHaveMore(from + amount));

        Gson gson = new Gson();
        String tracks = gson.toJson(getTracks(from, amount));
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getOutputStream().print(tracks);
    }

    @Route(tab1 = "library", tab2 = "", tab3 = "", action = "ajaxGetMoreTracks")
    public static String ajaxGetMoreTracks(HttpServletRequest request, HttpServletResponse response)
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        int from = Common.stringToInt(request.getParameter("from"));
        int amount = Common.stringToInt(request.getParameter("amount"));

        request.setAttribute("from", from);
        request.setAttribute("library", getTracks(from, amount));
        request.setAttribute("haveMore", isHaveMore(from + amount));

        return "/webroot/inc_libraryTracks.jsp";
    }

    @Route(tab1 = "library", tab2 = "", tab3 = "", action = "ajaxGetImage")
    public static void ajaxGetImage(HttpServletRequest request, HttpServletResponse response) throws IOException
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
                return;
            }
        }

        response.setContentType("image/jpeg");
        response.getOutputStream().write(new byte[0]);
    }

    @Route(tab1 = "library", tab2 = "", tab3 = "", action = "ajaxGetVisibleAdminScreens")
    public static void ajaxGetVisibleAdminScreens(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        List<SystemInfo.Tab> adminScreens = SystemInfo.INSTANCE.getAdminScreens();

        Gson gson = new Gson();

        String jsonResponse = "";
        if (userSession.getUser().isAdmin())
        {
            jsonResponse = gson.toJson(adminScreens);
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getOutputStream().print(jsonResponse);
    }

    @Route(tab1 = "library", tab2 = "", tab3 = "", action = "ajaxGetIsAdmin")
    public static void ajaxGetIsAdmin(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

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
