import { asc } from "drizzle-orm";
import { db } from "../../db.js";
import {
  albums as albumsTable,
  artists as artistsTable,
  track_artists,
} from "../../drizzle/main.js";

type Library = Awaited<ReturnType<typeof assembleLibrary>>;

const cache: { library?: Library } = { library: undefined };

const assembleLibrary = async () => {
  const tracks = await db.query.tracks
    .findMany({
      columns: { albumId: false },
      with: {
        trackArtists: {
          columns: {},
          orderBy: [asc(track_artists.index)],
          with: { artist: { columns: { id: true, name: true } } },
        },
        album: { columns: { id: true, name: true } },
      },
    })
    .then((tracks) =>
      tracks
        .map((track) => ({
          ...track,
          artists: track.trackArtists.map((trackArtist) => trackArtist.artist),
          trackArtists: undefined,
        }))
        .sort((t1, t2) => {
          const artistSort = (t1.artists[0]?.name || "").localeCompare(
            t2.artists[0]?.name || "",
          );
          if (artistSort !== 0) return artistSort;
          const albumSort = t1.album.name.localeCompare(t2.album.name);
          if (albumSort !== 0) return albumSort;
          const discSort = (t1.discNumber || 1) - (t2.discNumber || 1);
          if (discSort !== 0) return discSort;
          return (t1.trackNumber || 1) - (t2.trackNumber || 1);
        }),
    );

  const albums = await db.query.albums
    .findMany({
      with: {
        albumArtists: {
          columns: {},
          orderBy: [asc(track_artists.index)],
          with: { artist: { columns: { id: true, name: true } } },
        },
      },
      orderBy: [asc(albumsTable.name)],
    })
    .then((albums) =>
      albums
        .map((album) => ({
          ...album,
          albumArtists: album.albumArtists.map(
            (albumArtist) => albumArtist.artist,
          ),
        }))
        .sort((album1, album2) => {
          const artist1 = album1.albumArtists[0]?.name || "";
          const artist2 = album2.albumArtists[0]?.name || "";
          if (!artist1) return 1;
          if (!artist2) return -1;
          return artist1.localeCompare(artist2);
        }),
    );

  const artists = await db.query.artists
    .findMany({
      with: {
        albumArtists: {
          columns: {},
          with: { album: { columns: { id: true, name: true } } },
        },
      },
      orderBy: [asc(artistsTable.name)],
    })
    .then((artists) =>
      artists.map((artist) => ({
        ...artist,
        albums: artist.albumArtists.map((albumArtist) => albumArtist.album),
        albumArtists: undefined,
        trackCount: tracks.filter((track) =>
          artist.albumArtists
            .map((albumArtist) => albumArtist.album)
            .map((album) => album.id)
            .includes(track.album.id),
        ).length,
      })),
    );

  return { tracks, artists, albums };
};

export const fetchLibrary = async () => {
  if (cache.library) {
    return cache.library;
  }
  const library = await assembleLibrary();
  cache.library = library;
  return library;
};

export const clearLibraryCache = () => {
  cache.library = undefined;
};
