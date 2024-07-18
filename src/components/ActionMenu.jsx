import React from "react";
import {
  FaEllipsisH,
  FaHeart,
  FaRegHeart,
  FaList,
  FaMinus,
  FaPlus,
  FaSync,
} from "react-icons/fa";
import {
  useUserStore,
  setSelectedContextMenuId,
} from "../common/UserContextProvider";
import {
  useAppStore,
  toggleTracksInPlaylist,
} from "../common/AppContextProvider";
import { useWindowSize } from "react-use";

export default function ActionMenu(props) {
  const selectedContextMenuId = useUserStore(
    (state) => state.selectedContextMenuId
  );
  const playlists = useAppStore((state) => state.playlists);
  const windowSize = useWindowSize();

  function toggleDropdown() {
    if (selectedContextMenuId === props.contextMenuId)
      setSelectedContextMenuId("");
    else setSelectedContextMenuId(props.contextMenuId);
  }

  function handleToggleTracksInPlaylist(
    playlistId,
    trackIds,
    action,
    replaceExisting
  ) {
    const formData = new FormData();
    formData.append("trackIds", trackIds);
    formData.append("mode", action);
    formData.append(
      "replaceExisting",
      replaceExisting ? replaceExisting : false
    );

    toggleTracksInPlaylist(playlistId, formData);
  }

  function addTracksToPlaylist(trackIds) {
    const playlistId = document.getElementById(
      "mediaItem" + props.contextMenuId + "AddToPlaylistSelect"
    ).value;
    handleToggleTracksInPlaylist(playlistId, trackIds, "add");
  }

  function removeTracksFromPlaylist(trackIds) {
    const playlistId = document.getElementById(
      "mediaItem" + props.contextMenuId + "removeFromPlaylistSelect"
    ).value;
    handleToggleTracksInPlaylist(playlistId, trackIds, "remove");
  }

  const tracks = props.tracks;
  const trackIds = tracks.map((track) => track.id);

  const favoritesPlaylist = playlists.find((playlist) => playlist.favorites);
  const favoritesIds = favoritesPlaylist.playlistTracks.map(
    (playlistTrack) => playlistTrack.track.id
  );
  const isFavorite = trackIds.every((trackId) =>
    favoritesIds.includes(trackId)
  );

  const queuePlaylist = playlists.find((playlist) => playlist.queue);
  const queueIds = queuePlaylist.playlistTracks.map(
    (playlistTrack) => playlistTrack.track.id
  );
  const isQueued = trackIds.every((trackId) => queueIds.includes(trackId));
  const equalsQueue = isQueued && trackIds.length === queueIds.length;

  const contextMenuId = props.contextMenuId;
  const isDropdownActive = selectedContextMenuId === contextMenuId;

  const addToPlaylistOptions = playlists
    .filter((playlist) => !playlist.favorites && !playlist.queue)
    .filter((playlist) => {
      const playlistTrackIds = playlist.playlistTracks.map(
        (playlistTrack) => playlistTrack.track.id
      );
      return !trackIds.every((trackId) => playlistTrackIds.includes(trackId));
    })
    .map((playlist) => (
      <option key={playlist.id} value={playlist.id} title={playlist.name}>
        {playlist.name.length > 24
          ? playlist.name.substring(0, 24)
          : playlist.name}
      </option>
    ));

  const removeFromPlaylistOptions = playlists
    .filter((playlist) => !playlist.favorites && !playlist.queue)
    .filter((playlist) => {
      const playlistTrackIds = playlist.playlistTracks.map(
        (playlistTrack) => playlistTrack.track.id
      );
      return trackIds.every((trackId) => playlistTrackIds.includes(trackId));
    })
    .map((playlist) => (
      <option key={playlist.id} value={playlist.id} title={playlist.name}>
        {playlist.name.length > 24
          ? playlist.name.substring(0, 24)
          : playlist.name}
      </option>
    ));

  const addToPlaylistPickerForm = (
    <form>
      <div className="field has-addons">
        <div className="control">
          <button className="button is-static is-small">
            <span className="icon is-small">
              <FaPlus />
            </span>
          </button>
        </div>
        <div className="control is-expanded">
          <span className="select is-small is-fullwidth">
            <select id={"mediaItem" + contextMenuId + "AddToPlaylistSelect"}>
              {addToPlaylistOptions}
            </select>
          </span>
        </div>
        <div className="control">
          <button
            className="button is-small is-primary"
            onClick={() => addTracksToPlaylist(trackIds)}
            disabled={!addToPlaylistOptions.length}
          >
            Ok
          </button>
        </div>
      </div>
    </form>
  );

  const removeFromPlaylistPickerForm = (
    <form>
      <div className="field has-addons">
        <div className="control">
          <button className="button is-static is-small">
            <span className="icon is-small">
              <FaMinus />
            </span>
          </button>
        </div>
        <div className="control is-expanded">
          <span
            className="select is-small is-fullwidth"
            style={{ minWidth: "8em" }}
          >
            <select
              id={"mediaItem" + contextMenuId + "removeFromPlaylistSelect"}
            >
              {removeFromPlaylistOptions}
            </select>
          </span>
        </div>
        <div className="control">
          <button
            className="button is-small is-primary"
            onClick={() => removeTracksFromPlaylist(trackIds)}
            disabled={!removeFromPlaylistOptions.length}
          >
            Ok
          </button>
        </div>
      </div>
    </form>
  );

  const button = document.getElementById(contextMenuId + "Button");
  const left = button ? button.getBoundingClientRect().left : 0;
  const isRightAligned = left > windowSize.width / 2 ? "is-right" : "";

  return (
    <div
      className={
        "dropdown invisible group-hover:visible" +
        isRightAligned +
        (isDropdownActive ? " is-active is-visible-important" : "")
      }
      style={props.style}
    >
      <div className="dropdown-trigger">
        <button
          className="button is-small"
          aria-haspopup="true"
          id={contextMenuId + "Button"}
          onClick={toggleDropdown}
        >
          <span className="icon is-small">
            <FaEllipsisH />
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu2" role="menu">
        <div className="dropdown-content">
          <a
            href="/"
            className="dropdown-item"
            onClick={(e) => {
              e.preventDefault();
              handleToggleTracksInPlaylist(
                favoritesPlaylist.id,
                trackIds,
                isFavorite ? "remove" : "add"
              );
            }}
          >
            <p>
              <span className={"icon has-text-success"}>
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
              </span>
              {isFavorite ? "Remove from " : "Add to "} Favorites
            </p>
          </a>
          <a
            href="/"
            className="dropdown-item"
            onClick={(e) => {
              e.preventDefault();
              handleToggleTracksInPlaylist(
                queuePlaylist.id,
                trackIds,
                isQueued ? "remove" : "add"
              );
            }}
          >
            <p>
              <span
                className={
                  "icon " + (isQueued ? "has-text-success" : "has-text-grey")
                }
              >
                <FaList />
              </span>
              {isQueued ? "Remove from " : "Add to "} Queue
            </p>
          </a>
          <a
            href="/"
            className="dropdown-item"
            onClick={(e) => {
              e.preventDefault();
              handleToggleTracksInPlaylist(
                queuePlaylist.id,
                trackIds,
                "add",
                true
              );
            }}
            disabled={equalsQueue}
          >
            <p>
              <span
                className={
                  "icon " + (equalsQueue ? "has-text-success" : "has-text-grey")
                }
              >
                <FaSync />
              </span>
              Replace Queue
            </p>
          </a>
          <div className="dropdown-item">{addToPlaylistPickerForm}</div>
          <div className="dropdown-item">{removeFromPlaylistPickerForm}</div>
        </div>
      </div>
    </div>
  );
}
