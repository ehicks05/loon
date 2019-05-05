package net.ehicks.loon;

import net.ehicks.loon.beans.Track;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class TranscoderTask
{
    private static final Logger log = LoggerFactory.getLogger(TranscoderTask.class);
    private static final String PROGRESS_KEY = "transcoder";
    private static boolean RUNNING = false;

    private Transcoder transcoder;

    public TranscoderTask(Transcoder transcoder)
    {
        this.transcoder = transcoder;
    }

    public void run(List<Track> tracks, int quality)
    {
        if (RUNNING)
            return;

        try
        {
            log.info("Transcoder task starting.");
            RUNNING = true;
            AtomicInteger tracksTranscoded = new AtomicInteger(0);
            AtomicInteger atomicProgress = new AtomicInteger(0);
            long start = System.currentTimeMillis();

            ProgressTracker.progressStatusMap.put(PROGRESS_KEY, new ProgressTracker.ProgressStatus(0, "incomplete"));

            tracks.stream().forEach(track -> {
                transcoder.transcode(track, quality);
                tracksTranscoded.incrementAndGet();

                int progress = (int) ((tracksTranscoded.get() / (double) tracks.size()) * 100);
                ProgressTracker.progressStatusMap.put(PROGRESS_KEY, new ProgressTracker.ProgressStatus(progress, "incomplete"));

                if (atomicProgress.get() != progress)
                {
                    atomicProgress.set(progress);
                    log.info("TranscoderTask progress: " + progress + "%");
                }
            });
        }
        finally
        {
            RUNNING = false;
            ProgressTracker.progressStatusMap.put(PROGRESS_KEY, new ProgressTracker.ProgressStatus(100, "complete"));
            log.info("Transcoder task finished.");
        }
    }
}
