package net.ehicks.loon.handlers.admin;

import net.ehicks.loon.routing.Route;
import net.ehicks.loon.UserSession;
import net.ehicks.loon.beans.*;
import net.ehicks.loon.util.PasswordUtil;
import net.ehicks.common.Common;
import net.ehicks.eoi.EOI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;

public class UserHandler
{
    private static final Logger log = LoggerFactory.getLogger(AdminHandler.class);

    @Route(path = "admin/users")
    public static void showManageUsers(HttpServletRequest request, HttpServletResponse response) throws ParseException, IOException
    {
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        String action = request.getParameter("action");
        if (action.equals("list"))
        {
            request.setAttribute("users", User.getAll());

            return;
        }

        if (action.equals("create"))
        {
            String logonId = Common.getSafeString(request.getParameter("fldLogonId"));
            User user = new User();
            user.setLogonId(logonId);
            long userId = EOI.insert(user, userSession);

            response.sendRedirect("view?tab1=admin&tab2=users&action=form");
        }

        if (action.equals("delete"))
        {
            Long userId = Common.stringToLong(request.getParameter("userId"));
            User user = User.getByUserId(userId);
            if (user != null)
                EOI.executeDelete(user, userSession);

            response.sendRedirect("view?tab1=admin&tab2=users&action=form");
        }

        if (action.equals("form"))
        {
            Long userId = Common.stringToLong(request.getParameter("userId"));
            User user = User.getByUserId(userId);
            request.setAttribute("user", user);

            return;
        }

        if (action.equals("modify"))
        {
            Long userId = Common.stringToLong(request.getParameter("userId"));
            User user = User.getByUserId(userId);
            if (user != null)
            {
                String logonId = Common.getSafeString(request.getParameter("logonId"));
                String firstName = Common.getSafeString(request.getParameter("firstName"));
                String lastName = Common.getSafeString(request.getParameter("lastName"));
                user.setLogonId(logonId);
                user.setFirstName(firstName);
                user.setLastName(lastName);
                EOI.update(user, userSession);
            }

            response.sendRedirect("view?tab1=admin&tab2=users&tab3=modify&action=form&userId=" + userId);
        }

        if (action.equals("changePassword"))
        {
            Long userId = Common.stringToLong(request.getParameter("userId"));
            User user = User.getByUserId(userId);
            if (user != null)
            {
                String password = Common.getSafeString(request.getParameter("password"));
                if (password.length() > 0)
                {
                    user.setPassword(PasswordUtil.digestPassword(password));
                    EOI.update(user, userSession);
                }
            }

            response.sendRedirect("view?tab1=admin&tab2=users&tab3=modify&action=form&userId=" + userId);
        }
    }
}
