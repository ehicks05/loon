import { keyBy } from "lodash-es";
import create from "zustand";
import { devtools } from "zustand/middleware";
import type { Album, Artist, Track } from "../types/trpc";

export const useLibraryStore = create<{
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
}>(
  devtools(
    () => ({
      tracks: [] as Track[],
      albums: [] as Album[],
      artists: [] as Artist[],
    }),
    { name: "library" },
  ),
);

export const useTrackMap = () => {
  return useLibraryStore((state) => keyBy(state.tracks, "id"));
};

export const getTrackByIdBasic = (id: string) => {
  const track = useLibraryStore
    .getState()
    .tracks.find((track) => track.id === id);
  return track;
};
export const getTrackById = (id: string) => {
  const track = useLibraryStore
    .getState()
    .tracks.find((track) => track.id === id);
  const album = useLibraryStore
    .getState()
    .albums.find((album) => album.id === track?.album.id);
  const artists = useLibraryStore((state) =>
    state.artists.filter((artist) =>
      (track?.artists || []).map((artist) => artist.id).includes(artist.id),
    ),
  );

  if (!track || !album || !artists) return undefined;
  return { ...track, album, artists };
};

export const getAlbumById = (id?: string) => {
  const album = useLibraryStore
    .getState()
    .albums.find((album) => album.id === id);
  const tracks = useLibraryStore
    .getState()
    .tracks.filter((track) => track.album.id === album?.id);
  const artists = useLibraryStore((state) =>
    state.artists.filter((artist) =>
      album?.albumArtists
        ?.map((albumArtist) => albumArtist?.id)
        .includes(artist.id),
    ),
  );

  if (!album || !tracks || !artists) return undefined;
  return { ...album, tracks, artists };
};

export const getArtistById = (id?: string) => {
  const artist = useLibraryStore
    .getState()
    .artists.find((artist) => artist.id === id);
  const albumIds = artist?.albums.map((album) => album.id);

  const tracks = useLibraryStore((state) =>
    state.tracks.filter((track) => albumIds?.includes(track.album.id)),
  );

  const albums = useLibraryStore
    .getState()
    .albums.filter((album) => albumIds?.includes(album.id))
    .map((album) => ({
      ...album,
      tracks: tracks.filter((track) => track.album.id === album.id),
    }));

  if (!artist || !albums || !tracks) return undefined;
  return { ...artist, albums, tracks };
};
