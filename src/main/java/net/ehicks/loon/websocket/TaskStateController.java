package net.ehicks.loon.websocket;

import net.ehicks.loon.tasks.TaskWatcher;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;

@Controller
public class TaskStateController implements PropertyChangeListener
{
    private SimpMessagingTemplate template;
    private TaskWatcher taskWatcher;

    public TaskStateController(SimpMessagingTemplate template, TaskWatcher taskWatcher) {
        this.template = template;
        this.taskWatcher = taskWatcher;

        this.taskWatcher.register(this);
    }

    @Override
    public void propertyChange(PropertyChangeEvent propertyChangeEvent) {
        this.template.convertAndSend("/topic/messages", taskWatcher.getTaskState());
    }

    @MessageMapping("/hello")
    @SendTo("/topic/messages")
    public TaskWatcher.TaskState greeting(String message)
    {
        System.out.println("message from client: " + message);

        return taskWatcher.getTaskState();
    }
}