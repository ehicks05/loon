package net.ehicks.loon;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.LoonSystemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ws.schild.jave.Encoder;
import ws.schild.jave.MultimediaObject;
import ws.schild.jave.encode.AudioAttributes;
import ws.schild.jave.encode.EncodingAttributes;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class Transcoder
{
    private static final Logger log = LoggerFactory.getLogger(Transcoder.class);
    private final LoonSystemRepository loonSystemRepo;

    public Transcoder(LoonSystemRepository loonSystemRepo)
    {
        this.loonSystemRepo = loonSystemRepo;
    }

    public void transcode(Track track, int quality)
    {
        LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
        Path transcodeFolder = Paths.get(loonSystem.getTranscodeFolder());

        try
        {
            Path source = Paths.get(track.getPath());
            Path temp = Files.createTempFile("", track.getId());
            Path target = transcodeFolder
                    .resolve(String.valueOf(quality))
                    .resolve(track.getId() + ".mp3");

            boolean isTranscodeNeeded = false;
            if (source.toFile().lastModified() > target.toFile().lastModified())
                isTranscodeNeeded = true;
            if (!isTranscodeNeeded)
                return;

            Files.createDirectories(Paths.get(loonSystem.getTranscodeFolder(), String.valueOf(quality)));

            long start = System.currentTimeMillis();
            new Encoder().encode(new MultimediaObject(source.toFile()), temp.toFile(), getEncodingAttributes(quality));

            Files.move(temp, target, StandardCopyOption.ATOMIC_MOVE);

            logPerformance(track, quality, target, start);
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }

    private void logPerformance(Track sourceTrack, int quality, Path target, long start)
    {
        BigDecimal duration = new BigDecimal(System.currentTimeMillis() - start).divide(new BigDecimal(1000), 2, RoundingMode.HALF_UP);
        BigDecimal multi = new BigDecimal(sourceTrack.getDuration()).divide(duration, 2, RoundingMode.HALF_UP);
        BigDecimal sizeMulti = new BigDecimal(target.toFile().length()).divide(new BigDecimal(sourceTrack.getSize()), 2, RoundingMode.HALF_UP);
        log.debug("Transcode to q" + quality + " took " + duration + " seconds. Speed: " + multi + "x. Size:" + sizeMulti + "x");
    }

    private EncodingAttributes getEncodingAttributes(int quality)
    {
        AudioAttributes audio = new AudioAttributes();
        audio.setCodec("libmp3lame");
        audio.setQuality(quality);

        EncodingAttributes attrs = new EncodingAttributes();
        attrs.setOutputFormat("mp3");
        attrs.setAudioAttributes(audio);
        return attrs;
    }
}
