package net.ehicks.loon.tasks;

import net.ehicks.loon.Transcoder;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.TrackRepository;
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
    private TaskWatcher taskWatcher;
    private TrackRepository trackRepo;
    private LoonSystemRepository loonSystemRepo;

    public TranscoderTask(Transcoder transcoder, TaskWatcher taskWatcher, TrackRepository trackRepo, LoonSystemRepository loonSystemRepo)
    {
        super(taskWatcher);
        this.transcoder = transcoder;
        this.taskWatcher = taskWatcher;
        this.trackRepo = trackRepo;
        this.loonSystemRepo = loonSystemRepo;

        taskWatcher.initTask(id);
    }

    public void performTask(Map<String, Object> options)
    {
        List<Track> tracks = trackRepo.findAll();
        int quality = Integer.valueOf(loonSystemRepo.findById(1L).orElse(null).getTranscodeQuality());

        try
        {
            AtomicInteger tracksTranscoded = new AtomicInteger(0);

            tracks.stream().forEach(track -> {
                transcoder.transcode(track, quality);
                tracksTranscoded.incrementAndGet();

                int progress = (int) ((tracksTranscoded.get() / (double) tracks.size()) * 100);
                taskWatcher.update(id, progress);
            });
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }
}
