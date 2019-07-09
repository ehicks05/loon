package net.ehicks.loon.tasks;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class TaskWatcher
{
    public static Map<String, TaskStatus> tasks = new ConcurrentHashMap<>();

    public static class TaskStatus
    {
        private int progress;
        private String status;

        public TaskStatus(int progress, String status)
        {
            this.progress = progress;
            this.status = status;
        }

        public int getProgress()
        {
            return progress;
        }

        public void setProgress(int progress)
        {
            this.progress = progress;
        }

        public String getStatus()
        {
            return status;
        }

        public void setStatus(String status)
        {
            this.status = status;
        }
    }

    public static void initTask(String id)
    {
        TaskWatcher.tasks.put(id, new TaskStatus(0, "not started"));
    }

    public static void update(String id, int progress)
    {
        tasks.get(id).setProgress(progress);
    }

    public static void update(String id, int progress, String status)
    {
        tasks.get(id).setProgress(progress);
        tasks.get(id).setStatus(status);
    }
}
