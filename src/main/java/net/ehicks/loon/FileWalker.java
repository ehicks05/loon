package net.ehicks.loon;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.FileVisitor;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
class FileWalker implements FileVisitor<Path>
{
    private static final Logger log = LoggerFactory.getLogger(FileWalker.class);
    private static final List<String> RECOGNIZED_EXTENSIONS = Arrays.asList("mp3", "flac", "wav", "m4a");
    private List<Path> paths = new ArrayList<>();

    @Override
    public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) throws IOException
    {
        if (dir.getFileName().toString().startsWith(".") || dir.toFile().isHidden())
            return FileVisitResult.SKIP_SUBTREE;

        return FileVisitResult.CONTINUE;
    }

    @Override
    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
        if (file.toFile().isHidden() || !isRecognizedExtension(file))
            return FileVisitResult.CONTINUE;

        paths.add(file);

        return FileVisitResult.CONTINUE;
    }

    private boolean isRecognizedExtension(Path path)
    {
        String filename = path.getFileName().toString();
        String extension = filename.substring(filename.lastIndexOf(".") + 1);
        return (RECOGNIZED_EXTENSIONS.contains(extension.toLowerCase()));
    }

    @Override
    public FileVisitResult visitFileFailed(Path file, IOException e) throws IOException {
        log.error(e.getMessage(), e);
        return FileVisitResult.CONTINUE;
    }

    @Override
    public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
        return FileVisitResult.CONTINUE;
    }

    public List<Path> getPaths() {
        return paths;
    }

    public void setPaths(List<Path> paths)
    {
        this.paths = paths;
    }
}