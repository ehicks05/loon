package net.ehicks.loon.tasks;

import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.net.URL;

public class ImageUtil
{
    private static final Logger log = LoggerFactory.getLogger(ImageUtil.class);

    private static final int thumbSize = 300;
    private static final String outputFormat = "png";

    public static byte[] getThumb(byte[] original) {
        if (original == null) return null;
        try {
            ByteArrayOutputStream thumbOs = new ByteArrayOutputStream();
            Thumbnails.of(new ByteArrayInputStream(original)).size(thumbSize, thumbSize)
                    .outputFormat(outputFormat).toOutputStream(thumbOs);
            return thumbOs.toByteArray();
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        return null;
    }

    public static byte[] urlToBytes(String url) {
        if (url == null || url.isEmpty()) return null;
        try {
            BufferedImage image = makeSquare(ImageIO.read(new URL(url)));
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(image, outputFormat, os);
            return os.toByteArray();
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        return null;
    }

    public static BufferedImage makeSquare(BufferedImage img)
    {
        if (img == null)
            return null;

        int w = img.getWidth();
        int h = img.getHeight();

        if (w == h)
            return img;

        int size = Math.max(w, h);

        BufferedImage finalImage = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics g = finalImage.getGraphics();
        BufferedImage background = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics gBackground = background.getGraphics();
        gBackground.setColor(new Color(0, 0, 0, 0));
        gBackground.fillRect(0, 0, size, size);

        int x = 0;
        int y = 0;
        if (img.getWidth() < size)
            x = (size - img.getWidth()) / 2;
        if (img.getHeight() < size)
            y = (size - img.getHeight()) / 2;

        g.drawImage(background, 0, 0, null);
        g.drawImage(img, x, y, null);

        return finalImage;
    }
}
