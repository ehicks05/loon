package net.ehicks.loon;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class LibraryLogic
{
    private static final Logger log = LoggerFactory.getLogger(LibraryLogic.class);

    private LoonSystemRepository loonSystemRepo;
    private TrackRepository trackRepo;

    public LibraryLogic(LoonSystemRepository loonSystemRepo, TrackRepository trackRepo)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.trackRepo = trackRepo;
    }

    public String getLibraryPathsJson()
    {
        Node root = getLibraryPaths();
        if (root == null)
            return "";

        List<Node> nodes = Collections.singletonList(root);

        try
        {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(nodes);
        }
        catch (Exception e)
        {
            log.error(e.getMessage(), e);
        }

        return "";
    }

    private Node getLibraryPaths()
    {
        String musicFolder = loonSystemRepo.findById(1L).orElse(null).getMusicFolder();
        if (musicFolder.isBlank())
            return null;

        Path libraryPath = Paths.get(musicFolder);

        AtomicInteger folderId = new AtomicInteger();
        Node root = new Node(libraryPath, libraryPath.getRoot().toString(), folderId.getAndDecrement());

        buildNodesFromPath(root, libraryPath, folderId, 0);

        for (Track track : trackRepo.findAll())
        {
            Path path = Paths.get(track.getPath());
            buildNodesFromPath(root, path, folderId, track.getId());
        }
        return root;
    }

    private void buildNodesFromPath(Node root, Path path, AtomicInteger folderId, long trackId)
    {
        Node context = root;
        for (int i = 0; i < path.getNameCount(); i++)
        {
            Path subPath = path.subpath(i, i + 1);
            boolean isFolder = Paths.get(path.getRoot().toString() + path.subpath(0, i+1)).toFile().isDirectory();

            int nodeId = isFolder ? folderId.getAndDecrement() : (int) trackId;

            Node child = context.getChildByTitle(subPath.toString());
            if (child == null)
            {
                child = new Node(path.subpath(0, i + 1), subPath.toString(), nodeId);
                context.getChildren().add(child);
            }
            context = child;
        }
    }
}
