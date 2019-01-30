package net.ehicks.loon;

import net.ehicks.loon.beans.Track;
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

    public Path transcode(Track sourceTrack, int quality)
    {
        try
        {
            Path source = Paths.get(sourceTrack.getPath());
            String relativeSourcePath = source.subpath(0, source.getNameCount()).toString();
            if (relativeSourcePath.endsWith("flac"))
                relativeSourcePath = relativeSourcePath.substring(0, relativeSourcePath.length() - 4) + "mp3";

            Path target = Paths.get(System.getProperty("java.io.tmpdir")).resolve(relativeSourcePath);
            if (target.toFile().exists())
                return target;

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

            //Encode
            Encoder encoder = new Encoder();
            encoder.encode(new MultimediaObject(source.toFile()), target.toFile(), attrs);

            return target;
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }

        return null;
    }
}
