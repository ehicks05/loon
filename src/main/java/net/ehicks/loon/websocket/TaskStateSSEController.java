package net.ehicks.loon.websocket;

import net.ehicks.loon.tasks.TaskWatcher;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import javax.servlet.http.HttpServletResponse;
import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
public class TaskStateSSEController implements PropertyChangeListener {
    private final TaskWatcher taskWatcher;
    private final List<SseEmitter> emitters = new ArrayList<>();
    ExecutorService sseMvcExecutor = Executors.newCachedThreadPool();

    public TaskStateSSEController(TaskWatcher taskWatcher) {
        this.taskWatcher = taskWatcher;
        this.taskWatcher.register(this);
    }

    @Override
    public void propertyChange(PropertyChangeEvent propertyChangeEvent) {
        sendEvent();
    }

    @GetMapping(path = "/system-events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamSseMvc(HttpServletResponse response) {
        response.setHeader("Cache-Control"," no-transform");
        SseEmitter emitter = new SseEmitter(-1L);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        sendEvent();
        return emitter;
    }

    private void sendEvent() {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        sseMvcExecutor.execute(() -> {
            SseEmitter.SseEventBuilder event = SseEmitter.event()
                    .data(taskWatcher.getTaskState())
                    .id("test")
                    .name("taskStateUpdate");

            emitters.forEach(emitter -> {
                try {
                    emitter.send(event);
                } catch (Exception e) {
                    emitter.completeWithError(e);
                    deadEmitters.add((emitter));
                }
            });
        });

        emitters.removeAll(deadEmitters);
    }
}
