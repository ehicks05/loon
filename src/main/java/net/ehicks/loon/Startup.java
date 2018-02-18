package net.ehicks.loon;

import net.ehicks.common.Common;
import net.ehicks.eoi.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContext;
import java.io.IOException;
import java.io.InputStream;
import java.time.ZonedDateTime;
import java.util.Properties;

public class Startup
{
    private static final Logger log = LoggerFactory.getLogger(Startup.class);

    static void loadProperties(ServletContext servletContext)
    {
        Properties properties = new Properties();

        try (InputStream input = servletContext.getResourceAsStream("/WEB-INF/loon.properties");)
        {
            properties.load(input);
        }
        catch (IOException e)
        {
            log.error(e.getMessage(), e);
        }

        SystemInfo.INSTANCE.setSystemStart(System.currentTimeMillis());
        SystemInfo.INSTANCE.setServletContext(servletContext);

        SystemInfo.INSTANCE.setAppName(Common.getSafeString(properties.getProperty("appName")));
        SystemInfo.INSTANCE.setDebugLevel(Common.stringToInt(properties.getProperty("debugLevel")));
        SystemInfo.INSTANCE.setDropCreateLoad(properties.getProperty("dropCreateLoad").equals("true"));

        SystemInfo.INSTANCE.setBackupDirectory(properties.getProperty("backupDirectory"));
        SystemInfo.INSTANCE.setOverridePropertiesDirectory(properties.getProperty("overridePropertiesDirectory"));

        ConnectionInfo dbConnectionInfo = new ConnectionInfo(Common.getSafeString(properties.getProperty("dbMode")),
                Common.getSafeString(properties.getProperty("dbHost")),
                Common.getSafeString(properties.getProperty("dbPort")),
                Common.getSafeString(properties.getProperty("dbName")),
                Common.getSafeString(properties.getProperty("dbUser")),
                Common.getSafeString(properties.getProperty("dbPass")),
                Common.getSafeString(properties.getProperty("h2DbCacheKBs")),
                Common.getSafeString(properties.getProperty("pgDumpPath")),
                Common.getSafeString(properties.getProperty("sqlserverServerInstance")));
        SystemInfo.INSTANCE.setDbConnectionInfo(dbConnectionInfo);

        servletContext.setAttribute("systemInfo", SystemInfo.INSTANCE);
    }

    static void loadVersionFile(ServletContext servletContext)
    {
        Properties properties = new Properties();

        try (InputStream input = servletContext.getResourceAsStream("/WEB-INF/version.txt");)
        {
            properties.load(input);
        }
        catch (IOException e)
        {
            log.error(e.getMessage(), e);
        }

        SystemInfo.INSTANCE.setVersion(properties.getProperty("Version"));
        SystemInfo.INSTANCE.setGitVersion(properties.getProperty("Revision"));
        SystemInfo.INSTANCE.setGitVersionDate(ZonedDateTime.parse(properties.getProperty("Revision-Date")));

        servletContext.setAttribute("systemInfo", SystemInfo.INSTANCE);
    }

    static void loadDBMaps(ServletContext servletContext)
    {
        long subTaskStart = System.currentTimeMillis();
        DBMap.loadDbMaps(servletContext.getRealPath("/WEB-INF/classes/net/ehicks/loon/beans"), "net.ehicks.loon.beans");
        log.debug("Loaded DBMAPS in {} ms", (System.currentTimeMillis() - subTaskStart));
    }

    static void createTables()
    {
        long subTaskStart = System.currentTimeMillis();
        int tablesCreated = 0;
        for (DBMap dbMap : DBMap.dbMaps)
            if (!EOI.isTableExists(dbMap.tableName))
            {
                String createTableStatement = SQLGenerator.getCreateTableStatement(dbMap);
                EOI.executeUpdate(createTableStatement);
                tablesCreated++;

                for (String indexDefinition : dbMap.indexDefinitions)
                    EOI.executeUpdate(indexDefinition);
            }
        log.info("Autocreated {}/{} tables in {} ms", tablesCreated, DBMap.dbMaps.size(), (System.currentTimeMillis() - subTaskStart));
    }

    static void dropTables()
    {
        long subTaskStart;
        subTaskStart = System.currentTimeMillis();
        int tablesDropped = 0;
        for (DBMap dbMap : DBMap.dbMaps)
        {
            String tableName = dbMap.tableName;
            try
            {
                if (EOI.isTableExists(tableName))
                {
                    log.debug("Dropping " + tableName + "...");
                    EOI.executeUpdate("drop table " + tableName);
                    tablesDropped++;
                }
            }
            catch (Exception e)
            {
                log.error("didnt drop {}", tableName);
            }
        }
        log.info("Dropped {}/{} existing tables in {} ms", tablesDropped, DBMap.dbMaps.size(), (System.currentTimeMillis() - subTaskStart));
    }

    static void migrateDb()
    {
        SQLMigrator.migrate(DBMap.dbMaps);
    }

    static void runSqlScripts()
    {

    }
}
