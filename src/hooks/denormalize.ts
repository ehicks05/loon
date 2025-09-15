import { uniq } from "lodash-es";
import type { LibraryResponse } from "../types/trpc";

export type Library = ReturnType<typeof denormalizeLibrary>;

type DenormalizedTrack = NonNullable<ReturnType<typeof denormalizeTrack>>;
type DenormalizedAlbum = ReturnType<typeof denormalizeAlbum>;

export const denormalizeLibrary = (api: LibraryResponse) => {
  const tracks = api.tracks
    .map((track) => denormalizeTrack(track, api))
    .filter((track): track is DenormalizedTrack => track !== undefined);
  const albums = api.albums.map((album) =>
    denormalizeAlbum(album, { ...api, tracks }),
  );
  const artists = api.artists.map((artist) =>
    denormalizeArtist(artist, { ...api, albums, tracks }),
  );

  return { artists, albums, tracks };
};

export const denormalizeTrack = (
  track: LibraryResponse["tracks"][number],
  api: LibraryResponse,
) => {
  const album = api.albums.find((album) => album.id === track.albumId);
  const artists = api.artists.filter((artist) =>
    track.artistIds.includes(artist.id),
  );

  if (!album) return undefined;

  return { ...track, album, artists };
};

export const denormalizeAlbum = (
  album: LibraryResponse["albums"][number],
  api: {
    artists: LibraryResponse["artists"];
    albums: LibraryResponse["albums"];
    tracks: DenormalizedTrack[];
  },
) => {
  const albumArtists = api.artists.filter((artist) =>
    album.albumArtistIds.includes(artist.id),
  );
  const tracks = api.tracks.filter((track) => track.album.id === album.id);

  return { ...album, albumArtists, tracks };
};

export const denormalizeArtist = (
  artist: LibraryResponse["artists"][number],
  api: {
    artists: LibraryResponse["artists"];
    tracks: DenormalizedTrack[];
    albums: DenormalizedAlbum[];
  },
) => {
  const albumIds = api.albums
    .filter((album) =>
      album.albumArtists.map(({ id }) => id).includes(artist.id),
    )
    .map(({ id }) => id);

  const albumTracks = api.tracks.filter((track) =>
    albumIds?.includes(track.album.id),
  );
  const albums = api.albums.filter((album) => albumIds?.includes(album.id));

  const compilationTracks = api.tracks.filter((track) =>
    track.artists.map(({ id }) => id).includes(artist?.id),
  );
  const compilationIds = uniq(compilationTracks.map((track) => track.album.id));
  const compilations = api.albums.filter((album) =>
    compilationIds.includes(album.id),
  );

  const tracks = [...albumTracks, ...compilationTracks];

  return { ...artist, albums, compilations, tracks };
};
