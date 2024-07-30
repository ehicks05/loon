import React from "react";
import { FaVolumeUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { deletePlaylist, useAppStore } from "../../common/AppContextProvider";
import { useUserStore } from "../../common/UserContextProvider";

export default function Playlists() {
  const playlists = useAppStore((state) => state.playlists);
  const selectedPlaylistId = useUserStore(
    (state) => state.userState.selectedPlaylistId,
  );
  function handleDeletePlaylist(playlistId: string) {
    if (window.confirm("Do you really want to delete this playlist?"))
      return deletePlaylist(playlistId);
  }

  return (
    <div>
      <section>
        <h1 className="font-bold text-2xl">Library</h1>
      </section>

      <section className="flex flex-col gap-2 items-start">
        <table>
          <tbody>
            <tr>
              <td className="p-2"> </td>
              <td className="p-2">Name</td>
              <td className="p-2 text-right">Tracks</td>
              <td className="p-2"> </td>
            </tr>
            {playlists.map((playlist, index) => {
              return (
                <tr key={playlist.id}>
                  <td className="p-2"> {index + 1}. </td>
                  <td className="p-2 font-bold">
                    <Link
                      to={`/playlists/${playlist.id}`}
                      className="flex items-center"
                    >
                      {playlist.name}

                      {playlist.id === selectedPlaylistId && (
                        <span className="w-4 h-4 text-green-500 ml-3">
                          <FaVolumeUp aria-hidden="true" />
                        </span>
                      )}
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

                      {!(playlist.queue || playlist.favorites) && (
                        <button
                          type="button"
                          className={"p-2 rounded bg-red-600"}
                          onClick={() => handleDeletePlaylist(playlist.id)}
                        >
                          Delete
                        </button>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Link
          className={"p-2 rounded bg-green-600 text-white"}
          to={"/playlists/new"}
        >
          New Playlist
        </Link>
      </section>
    </div>
  );
}
