package net.ehicks.loon.handlers.admin;

import net.ehicks.loon.*;
import net.ehicks.loon.routing.Route;
import net.ehicks.loon.util.CommonIO;
import net.ehicks.common.Common;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class BackupHandler
{
    private static final Logger log = LoggerFactory.getLogger(BackupHandler.class);

    @Route(tab1 = "admin", tab2 = "backups", tab3 = "", action = "form")
    public static String showBackups(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");
        File backupDir = new File(SystemInfo.INSTANCE.getBackupDirectory());
        List<File> backups = new ArrayList<>();
        if (backupDir.exists() && backupDir.isDirectory())
            backups = Arrays.asList(backupDir.listFiles());
        backups.removeIf(file -> !file.getName().contains("loon"));
        Collections.reverse(backups);
        request.setAttribute("backups", backups);

        return "/webroot/admin/backups.jsp";
    }

    @Route(tab1 = "admin", tab2 = "backups", tab3 = "", action = "create")
    public static void createBackup(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        BackupDbTask.backupToZip();

        response.sendRedirect("view?tab1=admin&tab2=backups&action=form");
    }

    @Route(tab1 = "admin", tab2 = "backups", tab3 = "", action = "delete")
    public static void deleteBackup(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        String backupName = Common.getSafeString(request.getParameter("backupName"));
        File file = new File(SystemInfo.INSTANCE.getBackupDirectory() + backupName);
        boolean result = file.delete();
        response.sendRedirect("view?tab1=admin&tab2=backups&action=form");
    }

    @Route(tab1 = "admin", tab2 = "backups", tab3 = "", action = "viewBackup")
    public static void viewBackup(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");
        String backupName = Common.getSafeString(request.getParameter("backupName"));
        File file = new File(SystemInfo.INSTANCE.getBackupDirectory() + backupName);

        CommonIO.sendFileInResponse(response, file, false);
    }
}
