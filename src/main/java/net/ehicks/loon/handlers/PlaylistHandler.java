package net.ehicks.loon.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializer;
import net.ehicks.common.Common;
import net.ehicks.eoi.EOI;
import net.ehicks.loon.LibraryLogic;
import net.ehicks.loon.UserSession;
import net.ehicks.loon.beans.Playlist;
import net.ehicks.loon.beans.PlaylistTrack;
import net.ehicks.loon.beans.Track;
import net.ehicks.loon.routing.Route;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class PlaylistHandler
{
    @Route(path = "playlists")
    public static void playlists(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        String action = request.getParameter("action");
        UserSession userSession = (UserSession) request.getSession().getAttribute("userSession");

        if (action.equals("form"))
        {
            GsonBuilder gsonBuilder = new GsonBuilder();

            JsonSerializer<Playlist> playlistSerializer = (src, typeOfSrc, context) -> {
                JsonObject jsonPlaylist = new JsonObject();

                jsonPlaylist.addProperty("id", src.getId());
                jsonPlaylist.addProperty("userId", src.getUserId());
                jsonPlaylist.addProperty("name", src.getName());
                jsonPlaylist.addProperty("size", src.getSize());

                return jsonPlaylist;
            };

            gsonBuilder.registerTypeAdapter(Playlist.class, playlistSerializer);

            Gson gson = gsonBuilder.create();

            String jsonResponse = gson.toJson(Playlist.getByUserId(userSession.getUserId()));

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(jsonResponse);
        }

        if (action.equals("getPlaylists"))
        {
            GsonBuilder gsonBuilder = new GsonBuilder();

            gsonBuilder.registerTypeAdapter(Playlist.class, new Playlist.Serializer());

            Gson gson = gsonBuilder.create();

            String jsonResponse = gson.toJson(Playlist.getByUserId(userSession.getUserId()));

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(jsonResponse);
        }

        if (action.equals("getPlaylist"))
        {
            GsonBuilder gsonBuilder = new GsonBuilder();

            gsonBuilder.registerTypeAdapter(Playlist.class, new Playlist.Serializer());

            Gson gson = gsonBuilder.create();

            long playlistId = Common.stringToLong(request.getParameter("id"));
            String jsonResponse = gson.toJson(Playlist.getById(playlistId));

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(jsonResponse);
        }

        if (action.equals("getLibraryTrackPaths"))
        {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(LibraryLogic.getLibraryPathsJson());
        }

        if (action.equals("ajaxGetInitialTracks"))
        {
            GsonBuilder gsonBuilder = new GsonBuilder();

            long playlistId = Common.stringToLong(request.getParameter("id"));

            gsonBuilder.registerTypeAdapter(Track.class, new Track.Serializer());

            Gson gson = gsonBuilder.create();

            List<Track> trackList = PlaylistTrack.getByPlaylistId(playlistId).stream()
                    .map(playlistTrack -> Track.getById(playlistTrack.getTrackId()))
                    .collect(Collectors.toList());

            String tracks = gson.toJson(trackList);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(tracks);
        }

        if (action.equals("add") || action.equals("modify"))
        {
            GsonBuilder gsonBuilder = new GsonBuilder();

            gsonBuilder.registerTypeAdapter(Playlist.class, new Playlist.Serializer());

            Gson gson = gsonBuilder.create();

            long playlistId = Common.stringToLong(request.getParameter("id"));
            Playlist playlist = Playlist.getById(playlistId);

            if (playlist == null && action.equals("add") && request.getParameter("name") != null)
            {
                playlist = new Playlist();
                playlist.setUserId(userSession.getUserId());
            }

            if (playlist != null)
            {
                String name = Common.getSafeString(request.getParameter("name"));
                if (!name.isEmpty())
                    playlist.setName(name);

                String trackIdsParam = Common.getSafeString(request.getParameter("trackIds"));
                List<Long> trackIds = Arrays.stream(trackIdsParam.split(","))
                        .map(Long::parseLong).collect(Collectors.toList());

                if (action.equals("add"))
                {
                    Long newPlaylistId = EOI.insert(playlist, userSession);
                    playlist.setId(newPlaylistId);
                }
                if (action.equals("modify"))
                    EOI.update(playlist, userSession);

                // playlist must have an ID at this point
                playlist.setTrackIds(trackIds, userSession);
            }

            String jsonResponse = gson.toJson(playlist);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(jsonResponse);
        }

        if (action.equals("delete"))
        {
            GsonBuilder gsonBuilder = new GsonBuilder();

            gsonBuilder.registerTypeAdapter(Playlist.class, new Playlist.Serializer());

            Gson gson = gsonBuilder.create();

            long playlistId = Common.stringToLong(request.getParameter("id"));
            Playlist playlist = Playlist.getById(playlistId);

            if (playlist != null)
            {
                // playlist must have an ID at this point
                playlist.setTrackIds(Collections.EMPTY_LIST, userSession);

                EOI.executeDelete(playlist, userSession);
            }

            String jsonResponse = gson.toJson(Playlist.getByUserId(userSession.getUserId()));

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(jsonResponse);
        }
    }
}
