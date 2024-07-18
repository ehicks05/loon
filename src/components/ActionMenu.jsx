import * as Popover from "@radix-ui/react-popover";
import React from "react";
import {
  FaEllipsisH,
  FaHeart,
  FaList,
  FaMinus,
  FaPlus,
  FaRegHeart,
  FaSync,
} from "react-icons/fa";
import {
  toggleTracksInPlaylist,
  useAppStore,
} from "../common/AppContextProvider";
import {
  setSelectedContextMenuId,
  useUserStore,
} from "../common/UserContextProvider";

const AddOrRemoveFromPlaylist = ({
  contextMenuId,
  options,
  mode,
  onSubmit,
  disabled,
}) => (
  <form>
    <div className="field has-addons">
      <div className="control">
        <button type="button" className="button is-static is-small">
          <span className="icon is-small">
            {mode === "add" ? <FaPlus /> : <FaMinus />}
          </span>
        </button>
      </div>
      <div className="control is-expanded">
        <span
          className="select is-small is-fullwidth"
          style={{ minWidth: "8em" }}
        >
          <select id={`mediaItem${contextMenuId}${mode}FromPlaylistSelect`}>
            {options}
          </select>
        </span>
      </div>
      <div className="control">
        <button
          type="button"
          className="button is-small is-primary"
          onClick={onSubmit}
          disabled={disabled}
        >
          Ok
        </button>
      </div>
    </div>
  </form>
);

export default function ActionMenu(props) {
  const selectedContextMenuId = useUserStore(
    (state) => state.selectedContextMenuId,
  );
  const playlists = useAppStore((state) => state.playlists);

  function toggleDropdown() {
    if (selectedContextMenuId === props.contextMenuId)
      setSelectedContextMenuId("");
    else setSelectedContextMenuId(props.contextMenuId);
  }

  function handleToggleTracksInPlaylist(
    playlistId,
    trackIds,
    action,
    replaceExisting,
  ) {
    const formData = new FormData();
    formData.append("trackIds", trackIds);
    formData.append("mode", action);
    formData.append(
      "replaceExisting",
      replaceExisting ? replaceExisting : false,
    );

    toggleTracksInPlaylist(playlistId, formData);
  }

  function addTracksToPlaylist(trackIds) {
    const playlistId = document.getElementById(
      `mediaItem${props.contextMenuId}AddToPlaylistSelect`,
    ).value;
    handleToggleTracksInPlaylist(playlistId, trackIds, "add");
  }

  function removeTracksFromPlaylist(trackIds) {
    const playlistId = document.getElementById(
      `mediaItem${props.contextMenuId}removeFromPlaylistSelect`,
    ).value;
    handleToggleTracksInPlaylist(playlistId, trackIds, "remove");
  }

  const tracks = props.tracks;
  const trackIds = tracks.map((track) => track.id);

  const favoritesPlaylist = playlists.find((playlist) => playlist.favorites);
  const favoritesIds = favoritesPlaylist.playlistTracks.map(
    (playlistTrack) => playlistTrack.track.id,
  );
  const isFavorite = trackIds.every((trackId) =>
    favoritesIds.includes(trackId),
  );

  const queuePlaylist = playlists.find((playlist) => playlist.queue);
  const queueIds = queuePlaylist.playlistTracks.map(
    (playlistTrack) => playlistTrack.track.id,
  );
  const isQueued = trackIds.every((trackId) => queueIds.includes(trackId));

  const contextMenuId = props.contextMenuId;

  const addToPlaylistOptions = playlists
    .filter((playlist) => !playlist.favorites && !playlist.queue)
    .filter((playlist) => {
      const playlistTrackIds = playlist.playlistTracks.map(
        (playlistTrack) => playlistTrack.track.id,
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
        (playlistTrack) => playlistTrack.track.id,
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

  return (
    <Popover.Root>
      <Popover.Trigger>
        <button
          type="button"
          className="button is-small"
          onClick={toggleDropdown}
        >
          <span className="icon is-small">
            <FaEllipsisH />
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content sideOffset={12} className="rounded bg-neutral-800 p-2">
          <Popover.Arrow />

          <button
            type="button"
            className="dropdown-item flex items-center gap-2"
            onClick={(e) => {
              handleToggleTracksInPlaylist(
                favoritesPlaylist.id,
                trackIds,
                isFavorite ? "remove" : "add",
              );
            }}
          >
            {isFavorite ? (
              <FaHeart className="text-green-500" />
            ) : (
              <FaRegHeart className="text-neutral-500" />
            )}
            {isFavorite ? "Remove " : "Add"} Favorite
          </button>

          <button
            type="button"
            className="dropdown-item flex items-center gap-2"
            onClick={(e) => {
              handleToggleTracksInPlaylist(
                queuePlaylist.id,
                trackIds,
                isQueued ? "remove" : "add",
              );
            }}
          >
            <FaList
              className={`${isQueued ? "text-green-500" : "text-neutral-500"}`}
            />
            {isQueued ? "Remove from " : "Add to "} Queue
          </button>

          <button
            type="button"
            className="dropdown-item flex items-center gap-2"
            onClick={(e) => {
              handleToggleTracksInPlaylist(
                queuePlaylist.id,
                trackIds,
                "add",
                true,
              );
            }}
          >
            <FaSync className="text-neutral-500" />
            Replace Queue
          </button>

          <AddOrRemoveFromPlaylist
            contextMenuId={contextMenuId}
            options={addToPlaylistOptions}
            mode={"add"}
            onSubmit={() => addTracksToPlaylist(trackIds)}
            disabled={!addToPlaylistOptions.length}
          />
          <AddOrRemoveFromPlaylist
            contextMenuId={contextMenuId}
            options={removeFromPlaylistOptions}
            mode={"remove"}
            onSubmit={() => removeTracksFromPlaylist(trackIds)}
            disabled={!removeFromPlaylistOptions.length}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
