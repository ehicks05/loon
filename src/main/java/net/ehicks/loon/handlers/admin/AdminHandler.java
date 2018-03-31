package net.ehicks.loon.handlers.admin;

import com.google.gson.Gson;
import net.ehicks.common.Common;
import net.ehicks.eoi.ConnectionInfo;
import net.ehicks.eoi.EOI;
import net.ehicks.eoi.Metrics;
import net.ehicks.loon.*;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.routing.Route;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

public class AdminHandler
{
    private static final Logger log = LoggerFactory.getLogger(AdminHandler.class);
    
    @Route(path = "admin/system")
    public static String showSystemInfo(HttpServletRequest request, HttpServletResponse response)
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");
        List<Object> dbInfo;
        Map<String, String> dbInfoMap = new LinkedHashMap<>();
        if (SystemInfo.INSTANCE.getDbConnectionInfo().getDbMode().equals(ConnectionInfo.DbMode.POSTGRESQL.toString()))
        {
            dbInfo = EOI.executeQuery("select * from pg_stat_database where datname='loon'");
            Object[] results = (Object[]) dbInfo.get(0);
            List<String> headers = Arrays.asList("datid","datname","numbackends","xact_commit","xact_rollback",
                    "blks_read","blks_hit","tup_returned","tup_fetched","tup_inserted","tup_updated","tup_deleted",
                    "conflicts","temp_files","temp_bytes","deadlocks","blk_read_time","blk_write_time","stats_reset");
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

    @Route(path = "admin/systemSettings")
    public static void showModifySystem(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        String action = request.getParameter("action");
        if (action.equals("form"))
        {
            Gson gson = new Gson();

            String jsonResponse = gson.toJson(LoonSystem.getSystem());

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(jsonResponse);
        }
        
        if (action.equals("modify"))
        {
            UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

            LoonSystem loonSystem = LoonSystem.getSystem();
            if (loonSystem != null)
            {
                loonSystem.setInstanceName(Common.getSafeString(request.getParameter("instanceName")));
                loonSystem.setLogonMessage(Common.getSafeString(request.getParameter("logonMessage")));
                loonSystem.setMusicFolder(Common.getSafeString(request.getParameter("musicFolder")));
                loonSystem.setTheme(Common.getSafeString(request.getParameter("theme")));
                EOI.update(loonSystem, userSession);

                if (Common.getSafeString(request.getParameter("rescan")).equals("true"))
                {
                    new Thread(MusicScanner::scan).start();
                }
            }

            Gson gson = new Gson();

            String jsonResponse = gson.toJson(LoonSystem.getSystem());

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(jsonResponse);
        }

        if (action.equals("getScanProgress"))
        {
            Gson gson = new Gson();

            ProgressStatus progressStatus = ProgressTracker.progressStatusMap.get("scanProgress");
            if (progressStatus == null)
                progressStatus = new ProgressStatus(0, "unknown");

            String jsonResponse = gson.toJson(progressStatus);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(jsonResponse);
        }
    }
}
