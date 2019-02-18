package net.ehicks.loon;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ProgressTracker
{
    public static Map<String, ProgressStatus> progressStatusMap = new ConcurrentHashMap<>();

    public static class ProgressStatus
    {
        private int progress;
        private String status;

        public ProgressStatus(int progress, String status)
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

}