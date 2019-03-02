package net.ehicks.loon;

import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.LoonSystemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ws.schild.jave.AudioAttributes;
import ws.schild.jave.Encoder;
import ws.schild.jave.EncodingAttributes;
import ws.schild.jave.MultimediaObject;

import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class Transcoder
{
    private static final Logger log = LoggerFactory.getLogger(Transcoder.class);
    private LoonSystemRepository loonSystemRepo;

    public Transcoder(LoonSystemRepository loonSystemRepo)
    {
        this.loonSystemRepo = loonSystemRepo;
    }

    public Path transcode(Track sourceTrack, int quality)
    {
        LoonSystem loonSystem = loonSystemRepo.findById(1L).orElse(null);
        Path transcodeFolder = Paths.get(loonSystem.getTranscodeFolder());

        try
        {
            Path source = Paths.get(sourceTrack.getPath());
            Path target = transcodeFolder
                    .resolve(String.valueOf(quality))
                    .resolve(sourceTrack.getMusicBrainzTrackId() + ".mp3");

            new Encoder().encode(new MultimediaObject(source.toFile()), target.toFile(), getEncodingAttributes(quality));

            return target;
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }

        return null;
    }

    private EncodingAttributes getEncodingAttributes(int quality)
    {
        //Audio Attributes
        AudioAttributes audio = new AudioAttributes();
        audio.setCodec("libmp3lame");
        audio.setChannels(2);
        audio.setSamplingRate(44100); // todo: if we get rid of this will it use the source's sampling rate?
        audio.setQuality(quality);

        //Encoding attributes
        EncodingAttributes attrs = new EncodingAttributes();
        attrs.setFormat("mp3");
        attrs.setAudioAttributes(audio);
        return attrs;
    }
}
