package net.ehicks.loon;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;

@WebListener
public class ContextListener implements ServletContextListener
{
    private static final Logger log = LoggerFactory.getLogger(Controller.class);

    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent)
    {

    }

    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent)
    {
        // This manually deregisters JDBC driver, which prevents Tomcat 7 from complaining about memory leaks wrt this class
        Enumeration<Driver> drivers = DriverManager.getDrivers();
        while (drivers.hasMoreElements())
        {
            Driver driver = drivers.nextElement();
            try
            {
                DriverManager.deregisterDriver(driver);
                log.info("deregistering jdbc driver: {}", driver);
            }
            catch (SQLException e)
            {
                log.error("Error deregistering driver {}", driver);
                log.error(e.getMessage(), e);
            }
        }
    }
}