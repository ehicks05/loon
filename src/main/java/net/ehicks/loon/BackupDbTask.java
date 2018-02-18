package net.ehicks.loon;

import it.sauronsoftware.cron4j.Scheduler;
import net.ehicks.eoi.EOIBackup;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class BackupDbTask
{
    private static final Logger log = LoggerFactory.getLogger(BackupDbTask.class);
    private static final Scheduler scheduler = new Scheduler();

    public static Scheduler getScheduler()
    {
        return scheduler;
    }

    public static String getBackupPath() throws IOException
    {
        String today = new SimpleDateFormat("MM-dd-yyyy").format(new Date());
        String filename = "loon_" + today + EOIBackup.getBackupExtension();
        File backupFile = new File(SystemInfo.INSTANCE.getBackupDirectory() + filename);
        return backupFile.getCanonicalPath();
    }

    public static void scheduleTask()
    {
        String taskId = scheduler.schedule("0 2 * * *", BackupDbTask::backupToZip);
        log.info("Scheduling task " + taskId);
        scheduler.start();
    }

    public static void backupToZip()
    {
        try
        {
            log.info("Starting BackupDbTask");
            String backupPath = getBackupPath();
            String zippedBackupPath = backupPath.substring(0, backupPath.lastIndexOf(".")) + ".zip";
            new File(zippedBackupPath).delete();
            
            EOIBackup.backup(backupPath, SystemInfo.INSTANCE.getDbConnectionInfo());

            try (InputStream inputStream = new BufferedInputStream(new FileInputStream(backupPath));
                 ZipOutputStream outputStream = new ZipOutputStream(new FileOutputStream(zippedBackupPath));)
            {
                ZipEntry zipEntry = new ZipEntry(new File(backupPath).getName());
                outputStream.putNextEntry(zipEntry);

                IOUtils.copy(inputStream, outputStream);
            }

            new File(backupPath).delete();
            log.info("Finished BackupDbTask");
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }
}
