import React from "react";
import { Link } from "react-router-dom";
import { deletePlaylist, useAppStore } from "../../common/AppContextProvider";
import { useUserStore } from "../../common/UserContextProvider";

export default function Playlists() {
  const playlists = useAppStore((state) => state.playlists);
  const selectedPlaylistId = useUserStore(
    (state) => state.userState.selectedPlaylistId,
  );
  function handleDeletePlaylist(playlistId) {
    if (window.confirm("Do you really want to delete this playlist?"))
      return deletePlaylist(playlistId);
  }

  const playlistItems = playlists.filter(
    (playlist) => !playlist.favorites && !playlist.queue,
  );

  return (
    <div>
      <section className={"section"}>
        <h1 className="text-xl">Playlists</h1>
      </section>

      <section className="flex flex-col gap-4 items-start">
        <table className={""}>
          <tbody>
            <tr>
              <td className="p-2"> </td>
              <td className="p-2">Name</td>
              <td className="p-2 text-right">Tracks</td>
              <td className="p-2"> </td>
            </tr>
            {playlistItems.map((playlist, index) => {
              return (
                <tr
                  key={playlist.id}
                  className={
                    playlist.id === selectedPlaylistId
                      ? " playingHighlight"
                      : ""
                  }
                >
                  <td className="p-2"> {index + 1} </td>
                  <td className="p-2 font-bold">
                    <Link to={`/playlists/${playlist.id}`}>
                      {playlist.name}
                    </Link>
                  </td>
                  <td className="p-2 text-right">
                    {playlist.playlistTracks.length}
                  </td>
                  <td className="p-2">
                    <span className="flex gap-2">
                      <Link
                        className={"p-2 rounded bg-black"}
                        to={`/playlists/${playlist.id}/edit`}
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        className={"p-2 rounded bg-red-600"}
                        onClick={() => handleDeletePlaylist(playlist.id)}
                      >
                        Delete
                      </button>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Link className={"p-2 rounded bg-green-600"} to={"/playlists/new"}>
          New Playlist
        </Link>
      </section>
    </div>
  );
}
