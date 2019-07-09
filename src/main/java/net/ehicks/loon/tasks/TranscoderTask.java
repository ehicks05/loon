package net.ehicks.loon.tasks;

import net.ehicks.loon.Transcoder;
import net.ehicks.loon.beans.Track;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class TranscoderTask extends Task
{
    private static final Logger log = LoggerFactory.getLogger(TranscoderTask.class);
    public String id = "TranscoderTask";

    public String getId() {
        return id;
    }

    private Transcoder transcoder;

    public TranscoderTask(Transcoder transcoder)
    {
        this.transcoder = transcoder;

        TaskWatcher.initTask(id);
    }

    public void performTask(Map<String, Object> options)
    {
        List<Track> tracks = (List<Track>) options.get("tracks");
        int quality = (int) options.get("quality");

        try
        {
            log.info("Transcoder task starting.");
            AtomicInteger tracksTranscoded = new AtomicInteger(0);
            AtomicInteger atomicProgress = new AtomicInteger(0);

            tracks.stream().forEach(track -> {
                transcoder.transcode(track, quality);
                tracksTranscoded.incrementAndGet();

                int progress = (int) ((tracksTranscoded.get() / (double) tracks.size()) * 100);
                TaskWatcher.update(id, progress);

                if (atomicProgress.get() != progress)
                {
                    atomicProgress.set(progress);
                    log.info("TranscoderTask progress: " + progress + "%");
                }
            });
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }
}
