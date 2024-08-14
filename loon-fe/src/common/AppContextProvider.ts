import { groupBy, keyBy, map, uniq } from "lodash-es";
import create from "zustand";
import { devtools } from "zustand/middleware";
import type { Album, Artist, Playlist, Track } from "./types";

export const useAppStore = create<{
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
}>(
  devtools(
    () => ({
      tracks: [] as Track[],
      albums: [] as Album[],
      artists: [] as Artist[],
      playlists: [] as Playlist[],
    }),
    { name: "app" },
  ),
);

export const useTrackMap = () => {
  return useAppStore((state) => keyBy(state.tracks, "id"));
};

export const useDistinctArtists = () => {
  return useAppStore((state) => uniq(map(state.tracks, "artist")));
};

export const getTrackById = (id: string) => {
  return useAppStore.getState().tracks.find((t) => t.id === id);
};

export const getPlaylistById = (id: string) => {
  return useAppStore.getState().playlists.find((p) => p.id === id);
};

// Update indices locally for quick render, later backend will return authoritative results.
export const handleLocalDragAndDrop = ({
  playlistId,
  oldIndex,
  newIndex,
}: { playlistId: string; oldIndex: number; newIndex: number }) => {
  const playlists = useAppStore.getState().playlists;
  const playlist = playlists.find((p) => p.id === playlistId);
  const rest = playlists.filter((p) => p.id !== playlistId);

  if (!playlist) {
    return;
  }

  // splice the moving track from oldIndex to newIndex,
  // then do a brute force reindexing
  const tracks = [...playlist.playlistTracks];
  const track = tracks[oldIndex];
  tracks.splice(oldIndex, 1);
  tracks.splice(newIndex, 0, track);
  tracks.forEach((track, i) => {
    track.index = i;
  });

  playlist.playlistTracks = tracks;
  useAppStore.setState((state) => ({
    ...state,
    playlists: [...rest, playlist],
  }));
};

const tracksToArtist = (tracks: Track[]): Artist => ({
  name: tracks[0].artist,
  image: tracks[0].spotifyArtistImage,
  imageThumb: tracks[0].spotifyArtistImageThumb,
  albums: Object.entries(groupBy(tracks, (o) => o.album)).map(
    ([_, tracks]) => ({
      artist: tracks[0].artist,
      name: tracks[0].album,
      image: tracks[0].spotifyAlbumImage,
      imageThumb: tracks[0].spotifyAlbumImageThumb,
      tracks,
    }),
  ),
});

const tracksToArtists = (tracks: Track[]): Artist[] => {
  const _artists = groupBy(tracks, (o) => o.artist);
  const artists = Object.entries(_artists).map(([_, tracks]) => ({
    ...tracksToArtist(tracks),
  }));
  return artists;
};

export const setTracks = (tracks: Track[]) => {
  const artists = tracksToArtists(tracks);
  const albums = artists.flatMap((o) => o.albums);
  useAppStore.setState((state) => ({ ...state, tracks, albums, artists }));
};
