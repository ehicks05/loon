import type { Playlist, Track } from "@/common/types";
import { trpc } from "@/utils/trpc";
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

function getUpdatedTrackList(
  mode: "add" | "remove" | "replace",
  _trackIds: string[],
  playlist: Playlist,
) {
  const playlistTrackIds = playlist.playlistTracks.map(
    ({ trackId }) => trackId,
  );

  return mode === "add"
    ? [...new Set([...playlistTrackIds, ..._trackIds])]
    : mode === "remove"
      ? playlistTrackIds.filter((trackId) => !_trackIds.includes(trackId))
      : _trackIds;
}

const isSaturated = (playlist: Playlist, trackIds: string[]) => {
  const playlistTrackIds = playlist.playlistTracks.map(
    ({ trackId }) => trackId,
  );
  return trackIds.every((trackId) => playlistTrackIds.includes(trackId));
};

export default function ActionMenu({ tracks }: { tracks: Track[] }) {
  const utils = trpc.useUtils();
  const { mutate } = trpc.playlist.upsert.useMutation({
    onSuccess: () => {
      utils.playlist.list.invalidate();
    },
  });
  const trackIds = tracks.map((track) => track.id);
  const playlists = useAppStore((state) => state.playlists);

  const favoritesPlaylist = playlists.find((playlist) => playlist.favorites);
  const isFavorite = isSaturated(favoritesPlaylist, trackIds);

  const queuePlaylist = playlists.find((playlist) => playlist.queue);
  const isQueued = isSaturated(queuePlaylist, trackIds);

  const regularPlaylists = playlists.filter(
    (playlist) => !playlist.favorites && !playlist.queue,
  );

  const [saturatedPlaylists, unsaturatedPlaylists] = partition(
    regularPlaylists,
    (playlist) => isSaturated(playlist, trackIds),
  );

  const addToPlaylistOptions = unsaturatedPlaylists.map(playlistToOption);
  const removeFromPlaylistOptions = saturatedPlaylists.map(playlistToOption);

  const [playlistToAddTo, setPlaylistToAddTo] = useState(
    unsaturatedPlaylists[0]?.id || "",
  );
  const [playlistToRemoveFrom, setPlaylistToRemoveFrom] = useState(
    saturatedPlaylists[0]?.id || "",
  );

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
              const updatedTrackIds = getUpdatedTrackList(
                isFavorite ? "remove" : "add",
                trackIds,
                favoritesPlaylist,
              );
              mutate({
                id: favoritesPlaylist.id,
                name: favoritesPlaylist.name,
                trackIds: updatedTrackIds,
              });
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
              const updatedTrackIds = getUpdatedTrackList(
                isQueued ? "remove" : "add",
                trackIds,
                queuePlaylist,
              );
              mutate({
                id: queuePlaylist.id,
                name: queuePlaylist.name,
                trackIds: updatedTrackIds,
              });
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
              const updatedTrackIds = getUpdatedTrackList(
                "replace",
                trackIds,
                queuePlaylist,
              );
              mutate({
                id: queuePlaylist.id,
                name: queuePlaylist.name,
                trackIds: updatedTrackIds,
              });
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
              onClick={() => {
                const playlist = playlists.find(
                  (p) => p.id === playlistToAddTo,
                );
                if (!playlist) {
                  return;
                }
                const updatedTrackIds = getUpdatedTrackList(
                  "add",
                  trackIds,
                  playlist,
                );
                console.log({ playlist, updatedTrackIds });
                mutate({
                  id: playlist.id,
                  name: playlist.name,
                  trackIds: updatedTrackIds,
                });
              }}
              disabled={!playlistToAddTo}
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
              onClick={() => {
                const playlist = playlists.find(
                  (p) => p.id === playlistToRemoveFrom,
                );
                if (!playlist) {
                  return;
                }
                const updatedTrackIds = getUpdatedTrackList(
                  "remove",
                  trackIds,
                  playlist,
                );
                mutate({
                  id: playlist.id,
                  name: playlist.name,
                  trackIds: updatedTrackIds,
                });
              }}
              disabled={!playlistToRemoveFrom}
            >
              Ok
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
