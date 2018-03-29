package net.ehicks.loon.handlers;

import net.ehicks.loon.routing.Route;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;

public class SettingsHandler
{
    @Route(path = "settings")
    public static String showSettings(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        return "/webroot/settings.jsp";
    }
}
