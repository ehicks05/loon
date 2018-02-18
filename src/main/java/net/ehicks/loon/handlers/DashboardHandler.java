package net.ehicks.loon.handlers;

import net.ehicks.loon.routing.Route;
import net.ehicks.loon.UserSession;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;

public class DashboardHandler
{
    @Route(tab1 = "dashboard", tab2 = "", tab3 = "", action = "form")
    public static String showDashboard(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        return "/webroot/dashboard.jsp";
    }
}
