package net.ehicks.loon.handlers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonSerializer;
import net.ehicks.loon.UserSession;
import net.ehicks.loon.beans.LoonSystem;
import net.ehicks.loon.beans.Playlist;
import net.ehicks.loon.routing.Route;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

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

        if (action.equals("modify"))
        {
            Gson gson = new Gson();

            String jsonResponse = gson.toJson(LoonSystem.getSystem());

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getOutputStream().print(jsonResponse);
        }
    }
}
