import type { Playlist, Track } from "@/common/types";
import * as Popover from "@radix-ui/react-popover";
import { partition } from "lodash";
import { useState } from "react";
import {
  FaEllipsisH,
  FaHeart,
  FaList,
  FaMinus,
  FaPlus,
  FaRegHeart,
  FaSync,
} from "react-icons/fa";
import { useAppStore } from "../common/AppContextProvider";

const playlistToOption = (playlist: Playlist) => (
  <option key={playlist.id} value={playlist.id} title={playlist.name}>
    {playlist.name.length > 24 ? playlist.name.substring(0, 24) : playlist.name}
  </option>
);

function toggleTracksInPlaylist(
  playlistId: string,
  trackIds: string[],
  mode: "add" | "remove" | "replace",
) {
  alert(JSON.stringify({ playlistId, trackIds, mode }, null, 2));
}

export default function ActionMenu({ tracks }: { tracks: Track[] }) {
  const [playlistToAddTo, setPlaylistToAddTo] = useState("");
  const [playlistToRemoveFrom, setPlaylistToRemoveFrom] = useState("");
  const playlists = useAppStore((state) => state.playlists);

  const trackIds = tracks.map((track) => track.id);

  const [saturatedPlaylists, unsaturatedPlaylists] = partition(
    playlists,
    (playlist) => {
      const playlistTrackIds = playlist.playlistTracks.map(
        ({ trackId }) => trackId,
      );
      trackIds.every((trackId) => playlistTrackIds.includes(trackId));
    },
  );

  const favoritesPlaylist = playlists.find((playlist) => playlist.favorites);
  const isFavorite = !!saturatedPlaylists.find(({ favorites }) => favorites);

  const queuePlaylist = playlists.find((playlist) => playlist.queue);
  const isQueued = !!saturatedPlaylists.find(({ queue }) => queue);

  const addToPlaylistOptions = unsaturatedPlaylists
    .filter((playlist) => !playlist.favorites && !playlist.queue)
    .map(playlistToOption);

  const removeFromPlaylistOptions = saturatedPlaylists
    .filter((playlist) => !playlist.favorites && !playlist.queue)
    .map(playlistToOption);

  if (!favoritesPlaylist || !queuePlaylist) {
    return null;
  }

  return (
    <Popover.Root>
      <Popover.Trigger className="p-2 rounded bg-black">
        <FaEllipsisH />
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content
          sideOffset={12}
          className="flex flex-col text-neutral-400 p-2 rounded bg-neutral-800"
        >
          <Popover.Arrow />

          <button
            type="button"
            className="dropdown-item flex items-center gap-2 p-2"
            onClick={() => {
              toggleTracksInPlaylist(
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
            {isFavorite ? "Remove " : "Add"} to Favorites
          </button>

          <button
            type="button"
            className="dropdown-item flex items-center gap-2 p-2"
            onClick={() => {
              toggleTracksInPlaylist(
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
            className="dropdown-item flex items-center gap-2 p-2"
            onClick={() => {
              toggleTracksInPlaylist(queuePlaylist.id, trackIds, "replace");
            }}
          >
            <FaSync className="text-neutral-500" />
            Replace Queue
          </button>

          <div className="flex items-center">
            <span className="p-2">
              <FaPlus />
            </span>
            <div className="flex-grow p-2">
              <select
                value={playlistToAddTo}
                onChange={(e) => setPlaylistToAddTo(e.target.value)}
                className="w-full bg-neutral-700 p-1"
              >
                {addToPlaylistOptions}
              </select>
            </div>
            <button
              type="button"
              className="p-2 bg-black rounded"
              onSubmit={() =>
                toggleTracksInPlaylist(playlistToAddTo, trackIds, "add")
              }
              disabled={!addToPlaylistOptions.length}
            >
              Ok
            </button>
          </div>

          <div className="flex items-center">
            <span className="p-2">
              <FaMinus />
            </span>
            <div className="flex-grow p-2">
              <select
                value={playlistToRemoveFrom}
                onChange={(e) => setPlaylistToRemoveFrom(e.target.value)}
                className="w-full bg-neutral-700 p-1"
              >
                {removeFromPlaylistOptions}
              </select>
            </div>
            <button
              type="button"
              className="p-2 bg-black rounded"
              onSubmit={() =>
                toggleTracksInPlaylist(playlistToRemoveFrom, trackIds, "remove")
              }
              disabled={!removeFromPlaylistOptions.length}
            >
              Ok
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
