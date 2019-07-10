package net.ehicks.loon.tasks;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LibrarySyncTask extends Task
{
    private static final Logger log = LoggerFactory.getLogger(LibrarySyncTask.class);
    public String id = "LibrarySyncTask";

    public String getId() {
        return id;
    }

    private MusicScanner musicScanner;
    private ImageScanner imageScanner;
    private TranscoderTask transcoderTask;

    public LibrarySyncTask(MusicScanner musicScanner, ImageScanner imageScanner, TranscoderTask transcoderTask) {
        this.musicScanner = musicScanner;
        this.imageScanner = imageScanner;
        this.transcoderTask = transcoderTask;

        TaskWatcher.initTask("LibrarySyncTask");
    }

    public void performTask(Map<String, Object> options)
    {
        musicScanner.run();
        imageScanner.run();
        transcoderTask.run();
    }
}
