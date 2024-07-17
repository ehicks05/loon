import React from "react";
import { Link } from "react-router-dom";
import { useAppStore, deletePlaylist } from "../../common/AppContextProvider";
import { useUserStore } from "../../common/UserContextProvider";

export default function Playlists() {
  const playlists = useAppStore((state) => state.playlists);
  const selectedPlaylistId = useUserStore(
    (state) => state.userState.selectedPlaylistId
  );
  function handleDeletePlaylist(playlistId) {
    if (window.confirm("Do you really want to delete this playlist?"))
      return deletePlaylist(playlistId);
  }

  const playlistItems = playlists
    .filter((playlist) => !playlist.favorites && !playlist.queue)
    .map((playlist, index) => {
      return (
        <tr
          key={playlist.id}
          className={
            playlist.id === selectedPlaylistId ? " playingHighlight" : ""
          }
        >
          <td> {index + 1} </td>
          <td>
            <Link to={"/playlists/" + playlist.id}>{playlist.name}</Link>
          </td>
          <td className={"has-text-right"}>{playlist.playlistTracks.length}</td>
          <td>
            <span className="buttons">
              <Link
                className={"button is-small"}
                to={"/playlists/" + playlist.id + "/edit"}
              >
                Edit
              </Link>

              <button
                className={"button is-small is-danger"}
                onClick={() => handleDeletePlaylist(playlist.id)}
              >
                Delete
              </button>
            </span>
          </td>
        </tr>
      );
    });

  return (
    <div>
      <section className={"section"}>
        <h1 className="title">Playlists</h1>
      </section>

      <section className="section">
        <table className={"table is-hoverable is-narrow is-striped"}>
          <tbody>
            <tr>
              <td> </td>
              <td>Name</td>
              <td className={"has-text-right"}>Tracks</td>
              <td> </td>
            </tr>
            {playlistItems}
          </tbody>
        </table>
        <Link className={"button is-primary"} to={"/playlists/new"}>
          New Playlist
        </Link>
      </section>
    </div>
  );
}
