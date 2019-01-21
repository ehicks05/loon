package net.ehicks.loon;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.repos.LoonSystemRepository;
import net.ehicks.loon.repos.PlaylistTrackRepository;
import net.ehicks.loon.repos.TrackRepository;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class LibraryLogic
{
    private LoonSystemRepository loonSystemRepo;
    private TrackRepository trackRepo;
    private PlaylistTrackRepository playlistTrackRepository;

    public LibraryLogic(LoonSystemRepository loonSystemRepo, TrackRepository trackRepo, PlaylistTrackRepository playlistTrackRepository)
    {
        this.loonSystemRepo = loonSystemRepo;
        this.trackRepo = trackRepo;
        this.playlistTrackRepository = playlistTrackRepository;
    }

    public String getLibraryPathsJson()
    {
        Node root = getLibraryPaths();

        // todo this is test code
        playlistTrackRepository.findByPlaylistIdOrderByIndex(1L).forEach(playlistTrack ->
                root.getDescendantById(playlistTrack.getTrackId().intValue()).ifPresent(node -> node.checked = true)
        );

        GsonBuilder gsonBuilder = new GsonBuilder().setPrettyPrinting();

        gsonBuilder.registerTypeAdapter(Node.class, new Node.ReactCheckboxTreeSerializer());

        Gson gson = gsonBuilder.create();

        List<Node> nodes = Arrays.asList(root);
        String json = gson.toJson(nodes);
//        System.out.println(json);

        return json;
    }

    private Node getLibraryPaths()
    {
        Path libraryPath = Paths.get(loonSystemRepo.findById(1L).orElse(null).getMusicFolder());

        AtomicInteger folderId = new AtomicInteger();
        Node root = new Node(libraryPath, libraryPath.getRoot().toString(), folderId.getAndDecrement(), libraryPath.toFile().isDirectory());

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
                child = new Node(path.subpath(0, i + 1), subPath.toString(), nodeId, isFolder);
                context.children.add(child);
            }
            context = child;
        }
    }
}
