package net.ehicks.loon.handlers.admin;

import net.ehicks.common.Common;
import net.ehicks.loon.BackupDbTask;
import net.ehicks.loon.SystemInfo;
import net.ehicks.loon.routing.Route;
import net.ehicks.loon.util.CommonIO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class BackupHandler
{
    private static final Logger log = LoggerFactory.getLogger(BackupHandler.class);

    @Route(path = "admin/backups")
    public static void showBackups(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        String action = request.getParameter("action");
        if (action.equals("form"))
        {
            File backupDir = new File(SystemInfo.INSTANCE.getBackupDirectory());
            List<File> backups = new ArrayList<>();
            if (backupDir.exists() && backupDir.isDirectory())
                backups = Arrays.asList(backupDir.listFiles());
            backups.removeIf(file -> !file.getName().contains("loon"));
            Collections.reverse(backups);
            request.setAttribute("backups", backups);

            return;
        }

        if (action.equals("create"))
        {
            BackupDbTask.backupToZip();

            response.sendRedirect("view?tab1=admin&tab2=backups&action=form");
        }

        if (action.equals("delete"))
        {
            String backupName = Common.getSafeString(request.getParameter("backupName"));
            File file = new File(SystemInfo.INSTANCE.getBackupDirectory() + backupName);
            boolean result = file.delete();
            response.sendRedirect("view?tab1=admin&tab2=backups&action=form");
        }

        if (action.equals("viewBackup"))
        {
            String backupName = Common.getSafeString(request.getParameter("backupName"));
            File file = new File(SystemInfo.INSTANCE.getBackupDirectory() + backupName);

            CommonIO.sendFileInResponse(response, file, false);
        }
    }
}
