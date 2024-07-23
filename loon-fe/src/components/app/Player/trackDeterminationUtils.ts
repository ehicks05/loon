import {
  getPlaylistById,
  useAppStore,
} from "../../../common/AppContextProvider";
import { useUserStore } from "../../../common/UserContextProvider";

export const getNewTrackId = (input: "prev" | "next") => {
  const { selectedTrackId, selectedPlaylistId, shuffle } =
    useUserStore.getState().userState;

  const currentPlaylistTrackIds =
    getCurrentPlaylistTrackIds(selectedPlaylistId);
  const currentTrackIndex = currentPlaylistTrackIds.indexOf(selectedTrackId);

  const newIndex = getNewIndex(
    input,
    currentTrackIndex,
    currentPlaylistTrackIds,
    shuffle,
  );

  const newTrackId = currentPlaylistTrackIds[newIndex];
  if (!newTrackId) console.error("Unable to select a new track id.");

  return newTrackId;
};

function getCurrentPlaylistTrackIds(selectedPlaylistId) {
  const tracks = useAppStore.getState().tracks;
  const currentPlaylist = getPlaylistById(selectedPlaylistId);
  if (currentPlaylist)
    return currentPlaylist.playlistTracks.map(
      (playlistTrack) => playlistTrack.track.id,
    );

  return tracks.map((track) => track.id);
}

function getNewIndex(
  input: "prev" | "next",
  currentTrackIndex: number,
  currentPlaylistTrackIds: string[],
  shuffle: boolean,
) {
  let newIndex = shuffle
    ? Math.floor(Math.random() * currentPlaylistTrackIds.length)
    : input === "prev"
      ? currentTrackIndex - 1
      : input === "next"
        ? currentTrackIndex + 1
        : -1;

  if (newIndex === -1) {
    console.error("Unable to select a new track index.");
  }

  if (newIndex < 0) newIndex = currentPlaylistTrackIds.length - 1;
  if (newIndex >= currentPlaylistTrackIds.length) newIndex = 0;

  return newIndex;
}
