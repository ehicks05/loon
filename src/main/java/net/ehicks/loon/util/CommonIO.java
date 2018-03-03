package net.ehicks.loon.util;

import net.ehicks.loon.beans.DBFile;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.imgscalr.Scalr;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CommonIO
{
    private static final Logger log = LoggerFactory.getLogger(CommonIO.class);

    public static void sleep(long millis)
    {
        try
        {
            Thread.sleep(millis);
        }
        catch (Exception e)
        {
            // do nothing
        }
    }

    public static void sendFileInResponse(HttpServletResponse response, File file, boolean inline) throws IOException
    {
        response.setContentType(URLConnection.guessContentTypeFromName(file.getName()));
        String contentDisposition = inline ? "inline" : "attachment";
        response.setHeader("Content-Disposition", String.format(contentDisposition + "; filename=%s", file.getName()));
        response.setContentLength(Long.valueOf(file.length()).intValue());

        try (InputStream inputStream = new FileInputStream(file);
             OutputStream outputStream = response.getOutputStream())
        {
            IOUtils.copy(inputStream, outputStream);
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }
    }

    public static void sendFileInResponse(HttpServletResponse response, DBFile dbFile, boolean inline) throws IOException
    {
        response.setContentType(URLConnection.guessContentTypeFromName(dbFile.getName()));
        String contentDisposition = inline ? "inline" : "attachment";
        response.setHeader("Content-Disposition", String.format(contentDisposition + "; filename=%s", dbFile.getName()));
        response.setContentLength(Long.valueOf(dbFile.getContent().length).intValue());

        try (InputStream inputStream = new ByteArrayInputStream(dbFile.getContent());
             OutputStream outputStream = response.getOutputStream())
        {
            IOUtils.copy(inputStream, outputStream);
        }
    }

    public static List<FileItem> getFilesFromRequest(HttpServletRequest request)
    {
        boolean isMultipart = ServletFileUpload.isMultipartContent(request);
        if (isMultipart)
        {
            // Create a factory for disk-based file items
            DiskFileItemFactory factory = new DiskFileItemFactory();

            // Configure a repository (to ensure a secure temp location is used)
            ServletContext servletContext = request.getServletContext();
            File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
            factory.setRepository(repository);

            // Create a new file upload handler
            ServletFileUpload upload = new ServletFileUpload(factory);

            // Parse the request
            try
            {
                List<FileItem> items = upload.parseRequest(request);
                return items;
            }
            catch (FileUploadException e)
            {
                log.error(e.getMessage(), e);
            }
        }

        return new ArrayList<>();
    }

    public static String getName(FileItem fileItem)
    {
        String fileName = fileItem.getName();
        if (fileName != null)
            fileName = FilenameUtils.getName(fileName);
        return fileName == null ? "" : fileName;
    }

    public static boolean isValidSize(FileItem fileItem)
    {
        return fileItem.getSize() <= 10 * 1024 * 1024; // 10MB
    }

    public static String getContentType(FileItem fileItem)
    {
        String contentType = fileItem.getContentType();
        if (contentType.length() == 0)
            contentType = URLConnection.guessContentTypeFromName(getName(fileItem));
        return contentType;
    }

    public static boolean isImage(FileItem fileItem)
    {
        return Arrays.asList("image/bmp", "image/gif", "image/jpeg", "image/png").contains(getContentType(fileItem));
    }

    public static byte[] getThumbnail(FileItem fileItem) throws IOException
    {
        return getThumbnail(fileItem.getInputStream(), getContentType(fileItem));
    }

    public static byte[] getThumbnail(InputStream inputStream, String contentType) throws IOException
    {
        BufferedImage srcImage = ImageIO.read(inputStream); // Load image
        Scalr.Mode mode = srcImage.getWidth() > srcImage.getHeight() ? Scalr.Mode.FIT_TO_WIDTH : Scalr.Mode.FIT_TO_HEIGHT;
        BufferedImage scaledImage = Scalr.resize(srcImage, mode, 128, 128); // Scale image
        String formatName = contentType.replace("image/", "");
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(scaledImage, formatName, byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();
    }
}
