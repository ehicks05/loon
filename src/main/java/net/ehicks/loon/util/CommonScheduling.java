package net.ehicks.loon.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

public class CommonScheduling
{
    private static final Logger log = LoggerFactory.getLogger(CommonScheduling.class);

    public static void shutDown(ExecutorService service)
    {
        log.info("Attempting to shut down executorService");
        service.shutdown(); // Disable new tasks from being submitted
        try
        {
            // Wait a while for existing tasks to terminate
            if (!service.awaitTermination(60, TimeUnit.SECONDS))
            {
                service.shutdownNow(); // Cancel currently executing tasks
                // Wait a while for tasks to respond to being cancelled
                if (!service.awaitTermination(60, TimeUnit.SECONDS))
                    log.error("executorService did not terminate");
            }
        }
        catch (InterruptedException ie)
        {
            // (Re-)Cancel if current thread also interrupted
            service.shutdownNow();
            // Preserve interrupt status
            Thread.currentThread().interrupt();
        }
    }
}
