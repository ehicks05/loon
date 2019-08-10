package net.ehicks.loon.websocket;

import net.ehicks.loon.tasks.TaskWatcher;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Controller
public class TaskStateSSEController implements PropertyChangeListener {
    private TaskWatcher taskWatcher;
    private List<SseEmitter> emitters = new ArrayList<>();
    private long timeout = 1000 * 60 * 60 * 24; // 24 hours

    public TaskStateSSEController(TaskWatcher taskWatcher) {
        this.taskWatcher = taskWatcher;

        this.taskWatcher.register(this);
    }

    @Override
    public void propertyChange(PropertyChangeEvent propertyChangeEvent) {
        sendEvent();
    }

    @GetMapping("/hello")
    public SseEmitter streamSseMvc() {
        SseEmitter emitter = new SseEmitter(timeout);
        emitters.add(emitter);
        sendEvent();
        return emitter;
    }

    private void sendEvent() {
        ExecutorService sseMvcExecutor = Executors.newSingleThreadExecutor();
        sseMvcExecutor.execute(() -> {
            SseEmitter.SseEventBuilder event = SseEmitter.event()
                    .data(taskWatcher.getTaskState())
                    .id("test")
                    .name("taskStateUpdate");

            emitters.forEach(sseEmitter -> {
                try {
                    sseEmitter.send(event);
                } catch (Exception e) {
                    sseEmitter.completeWithError(e);
                }
            });
        });
    }

}
