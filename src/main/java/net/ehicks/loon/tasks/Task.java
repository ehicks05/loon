package net.ehicks.loon.tasks;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public abstract class Task
{
    public static final Logger log = LoggerFactory.getLogger(Task.class);

    private boolean RUNNING = false;

    private TaskWatcher taskWatcher;
    public Task(TaskWatcher taskWatcher)
    {
        this.taskWatcher = taskWatcher;
    }

    public abstract String getId();

    public void run() {
        run(new HashMap<>());
    }

    public void run(Map<String, Object> options)
    {
        if (taskWatcher.isTasksRunning())
        {
            log.warn("Task run denied. Unable to run task " + getId() + ". Another task is already in progress.");
            return;
        }
        if (RUNNING)
            return;

        try
        {
            RUNNING = true;
            log.info("Starting " + getId());

            taskWatcher.announceStart(getId());
            long startTime = System.currentTimeMillis();
            options.put("startTime", startTime);

            performTask(options);

            long dur = System.currentTimeMillis() - startTime;

            log.info("Finished " + getId() + " in " + dur + "ms");
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
        finally
        {
            taskWatcher.announceCompletion(getId());

            RUNNING = false;
        }
    }

    public boolean isRunning()
    {
        return RUNNING;
    }

    public abstract void performTask(Map<String, Object> options);
}
