package net.ehicks.loon.handlers.admin;

import net.ehicks.loon.*;
import net.ehicks.loon.beans.*;
import net.ehicks.loon.routing.Route;
import net.ehicks.common.Common;
import net.ehicks.eoi.ConnectionInfo;
import net.ehicks.eoi.EOI;
import net.ehicks.eoi.Metrics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.util.*;

public class AdminHandler
{
    private static final Logger log = LoggerFactory.getLogger(AdminHandler.class);

    @Route(tab1 = "admin", tab2 = "", tab3 = "", action = "form")
    public static String showOverview(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        request.setAttribute("adminSubscreens", SystemInfo.INSTANCE.getAdminSubscreens());

        return "/webroot/admin/overview.jsp";
    }

    @Route(tab1 = "admin", tab2 = "system", tab3 = "info", action = "form")
    public static String showSystemInfo(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");
        List<Object> dbInfo;
        Map<String, String> dbInfoMap = new LinkedHashMap<>();
        if (SystemInfo.INSTANCE.getDbConnectionInfo().getDbMode().equals(ConnectionInfo.DbMode.POSTGRESQL.toString()))
        {
            dbInfo = EOI.executeQuery("select * from pg_stat_database where datname='loon'");
            Object[] results = (Object[]) dbInfo.get(0);
            List<String> headers = Arrays.asList("datid","datname","numbackends","xact_commit","xact_rollback","blks_read",
                    "blks_hit","tup_returned","tup_fetched","tup_inserted","tup_updated","tup_deleted","conflicts","temp_files",
                    "temp_bytes","deadlocks","blk_read_time","blk_write_time","stats_reset");
            for (int i = 0; i < headers.size(); i++)
            {
                dbInfoMap.put(headers.get(i), results[i].toString());
            }
            request.setAttribute("dbInfoMap", dbInfoMap);
        }
        else
            dbInfo = EOI.executeQuery("SELECT NAME, VALUE FROM INFORMATION_SCHEMA.SETTINGS");
        
        Map<String, String> cpInfo = Metrics.getMetrics();
        request.setAttribute("dbInfo", dbInfo);
        request.setAttribute("cpInfo", cpInfo);
        request.setAttribute("connectionInfo", SystemInfo.INSTANCE.getDbConnectionInfo());

        List<UserSession> userSessions = SessionListener.getSessions();
        userSessions.sort(Comparator.comparing(UserSession::getLastActivity).reversed());
        request.setAttribute("userSessions", userSessions);

        return "/webroot/admin/systemInfo.jsp";
    }

    @Route(tab1 = "admin", tab2 = "system", tab3 = "modify", action = "form")
    public static String showModifySystem(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        request.setAttribute("loonSystem", LoonSystem.getSystem());
        request.setAttribute("themes", Arrays.asList("default","cosmo","flatly","journal","lux","pulse","simplex","superhero","united","yeti"));
        return "/webroot/admin/modifySystem.jsp";
    }

    @Route(tab1 = "admin", tab2 = "system", tab3 = "modify", action = "modify")
    public static void modifySystem(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        LoonSystem loonSystem = LoonSystem.getSystem();
        if (loonSystem != null)
        {
            loonSystem.setInstanceName(Common.getSafeString(request.getParameter("instanceName")));
            loonSystem.setLogonMessage(Common.getSafeString(request.getParameter("logonMessage")));
            loonSystem.setDefaultAvatar(Common.stringToLong(request.getParameter("defaultAvatar")));
            loonSystem.setTheme(Common.getSafeString(request.getParameter("theme")));
            EOI.update(loonSystem, userSession);

            request.getServletContext().setAttribute("loonSystem", LoonSystem.getSystem());
        }

        response.sendRedirect("view?tab1=admin&tab2=system&tab3=modify&action=form");
    }
}
