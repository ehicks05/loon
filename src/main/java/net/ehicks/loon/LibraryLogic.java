package net.ehicks.loon;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.PlaylistTrack;
import net.ehicks.loon.beans.Track;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class LibraryLogic
{
    public static String getLibraryPathsJson()
    {
        Node root = getLibraryPaths();

        // todo this is test code
        PlaylistTrack.getByPlaylistId(1L).forEach(playlistTrack ->
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

    private static Node getLibraryPaths()
    {
        List<Track> tracks = Track.getAll();
        Path libraryPath = Paths.get(LoonSystem.getSystem().getMusicFolder());

        AtomicInteger folderId = new AtomicInteger();
        Node root = new Node(libraryPath, libraryPath.getRoot().toString(), folderId.getAndDecrement(), libraryPath.toFile().isDirectory());

        buildNodesFromPath(root, libraryPath, folderId, 0);

        for (Track track : tracks)
        {
            Path path = Paths.get(track.getPath());
            buildNodesFromPath(root, path, folderId, track.getId());
        }
        return root;
    }

    private static void buildNodesFromPath(Node root, Path path, AtomicInteger folderId, long trackId)
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
