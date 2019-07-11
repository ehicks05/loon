package net.ehicks.loon.tasks;

import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class TaskWatcher
{
    private TaskState taskState = new TaskState();
    public TaskWatcher() {
    }

    public static class TaskState
    {
        private Map<String, TaskStatus> tasks = new ConcurrentHashMap<>();
        private int tasksRunning = 0;

        public Map<String, TaskStatus> getTasks() {
            return tasks;
        }

        public void setTasks(Map<String, TaskStatus> tasks) {
            this.tasks = tasks;
        }

        public int getTasksRunning() {
            return tasksRunning;
        }

        public void setTasksRunning(int tasksRunning) {
            this.tasksRunning = tasksRunning;
        }
    }

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

    public void initTask(String id)
    {
        taskState.getTasks().put(id, new TaskStatus(0, "not started"));
    }

    public void update(String id, int progress)
    {
        taskState.getTasks().get(id).setProgress(progress);

        // todo: this is a hacky way to keep LibrarySyncTask's progress up-to-date.
        if (!id.equals("LibrarySyncTask") && taskState.getTasks().get("LibrarySyncTask").getStatus().equals("incomplete"))
        {
            List<String> subTasks = Arrays.asList("MusicScanner", "ImageScanner", "TranscoderTask");
            int totalSubTaskProgress = taskState.getTasks().entrySet().stream()
                    .filter(entry -> subTasks.contains(entry.getKey()))
                    .mapToInt(entry -> entry.getValue().getProgress())
                    .sum();
            int librarySyncTaskProgress = totalSubTaskProgress / 3;
            update("LibrarySyncTask", librarySyncTaskProgress);
        }
    }

    public void announceStart(String id)
    {
        taskState.getTasks().get(id).setProgress(0);
        taskState.getTasks().get(id).setStatus("incomplete");

        if (!id.equals("LibrarySyncTask")) // todo: this line is a hack
            taskState.setTasksRunning(taskState.getTasksRunning() + 1);
    }

    public void announceCompletion(String id)
    {
        taskState.getTasks().get(id).setProgress(100);
        taskState.getTasks().get(id).setStatus("complete");

        if (!id.equals("LibrarySyncTask")) // todo: this line is a hack
            taskState.setTasksRunning(taskState.getTasksRunning() - 1);
    }

    public boolean isTasksRunning() {
        return taskState.getTasksRunning() > 0;
    }

    public void resetProgress() {
        taskState.getTasks().values().forEach(taskStatus -> {taskStatus.setProgress(0); taskStatus.setStatus("incomplete");});
    }

    public TaskState getTaskState() {
        return taskState;
    }

    public void setTaskState(TaskState taskState) {
        this.taskState = taskState;
    }
}
