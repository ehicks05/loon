package net.ehicks.loon.handlers.admin;

import net.ehicks.loon.util.CommonIO;
import net.ehicks.loon.routing.Route;
import net.ehicks.loon.SystemInfo;
import net.ehicks.loon.UserSession;
import net.ehicks.common.Common;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.text.ParseException;
import java.util.*;

public class LogHandler
{
    @Route(tab1 = "admin", tab2 = "logs", tab3 = "", action = "form")
    public static String showLogs(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");
        File logsDir = new File(SystemInfo.INSTANCE.getLogDirectory());
        List<File> logs = new ArrayList<>(Arrays.asList(logsDir.listFiles()));
        logs.removeIf(file -> !file.getName().contains("loon"));
        logs.sort((o1, o2) -> {
            if (o1.lastModified() == o2.lastModified()) return 0;
            if (o1.lastModified() > o2.lastModified()) return -1;
            if (o1.lastModified() < o2.lastModified()) return 1;
            return 0;
        });
        request.setAttribute("logs", logs);

        return "/webroot/admin/logs.jsp";
    }

    @Route(tab1 = "admin", tab2 = "logs", tab3 = "", action = "delete")
    public static void deleteLog(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        String logName = Common.getSafeString(request.getParameter("logName"));
        File file = new File(SystemInfo.INSTANCE.getLogDirectory() + logName);
        file.delete();
        response.sendRedirect("view?tab1=admin&tab2=logs&action=form");
    }

    @Route(tab1 = "admin", tab2 = "logs", tab3 = "", action = "viewLog")
    public static void viewLog(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");
        String logName = Common.getSafeString(request.getParameter("logName"));
        File file = new File(SystemInfo.INSTANCE.getLogDirectory() + logName);

        CommonIO.sendFileInResponse(response, file, true);
    }

    @Route(tab1 = "admin", tab2 = "logs", tab3 = "", action = "viewLogPretty")
    public static String viewLogPretty(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        String logName = Common.getSafeString(request.getParameter("logName"));
        File file = new File(SystemInfo.INSTANCE.getLogDirectory() + logName);

        Map<String, String> threadToColorMap = new HashMap<>();
        List<List<String>> lines = new ArrayList<>();
        for (String line : Files.readAllLines(file.toPath(), Charset.defaultCharset()))
        {
            try
            {
                parseLine(lines, line, threadToColorMap);
            }
            catch (Exception e)
            {
                parseLineRaw(lines, line);
            }
        }

        request.setAttribute("lines", lines);
        request.setAttribute("logName", logName);
        request.setAttribute("threadToColorMap", threadToColorMap);
        return "/webroot/admin/viewLog.jsp";
    }

    private static void parseLine(List<List<String>> lines, String line, Map<String, String> threadToColorMap)
    {
        int dateLength = 15;
        String date = line.substring(0, dateLength);
        line = line.substring(dateLength + 1);

        int openCount = 1;
        int closeIndex = 1;
        while (openCount > 0)
        {
            if (line.charAt(closeIndex) == ']')
                openCount--;
            if (line.charAt(closeIndex) == '[')
                openCount++;
            closeIndex++;
        }
        String thread = line.substring(0, closeIndex + 1);
        String threadWithoutBrackets = thread.substring(1, thread.length() - 2);
        if (threadWithoutBrackets.length() > 64)
            threadWithoutBrackets = threadWithoutBrackets.substring(0, 64) + "...";
        threadToColorMap.putIfAbsent(threadWithoutBrackets, getColorFromThread(threadWithoutBrackets));

        line = line.substring(closeIndex + 1);
        String level = line.substring(0, line.indexOf(" "));

        line = line.substring(line.indexOf(" ") + 2);
        String myClass = line.substring(0, line.indexOf(" "));
        String classWithoutPackage = myClass.substring(myClass.lastIndexOf(".") + 1);

        line = line.substring(line.indexOf(" ") + 4);
        String message = line;

        lines.add(Arrays.asList(date, threadWithoutBrackets, level, classWithoutPackage, message));
    }

    private static String getColorFromThread(String thread)
    {
        String hash = String.valueOf(thread.hashCode() * 64);
        int r = 0;
        int g = 0;
        int b = 0;
        for (char aChar : hash.toCharArray())
        {
            if (hash.indexOf(aChar) % 3 == 0)
                r += aChar;
            if (hash.indexOf(aChar) % 3 == 1)
                g += aChar;
            if (hash.indexOf(aChar) % 3 == 2)
                b += aChar;
        }
        r %= 255;
        g %= 255;
        b %= 255;
        r /= 3;
        g /= 3;
        b /= 3;
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
        return String.format("#%02x%02x%02x", r, g, b);
    }

    private static void parseLineRaw(List<List<String>> lines, String line)
    {
        lines.add(Arrays.asList("", "", "", "", line));
    }
}
