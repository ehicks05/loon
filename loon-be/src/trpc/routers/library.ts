import { asc, eq } from "drizzle-orm";
import { uint8ArrayToBase64 } from "uint8array-extras";
import { z } from "zod";
import { db } from "../../db.js";
import {
  albums as albumsTable,
  artists as artistsTable,
  track_artists,
  tracks as tracksTable,
} from "../../drizzle/main.js";
import { getPictures } from "../../utils/metadata.js";
import { publicProcedure, router } from "../trpc.js";

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
      albums.map((album) => ({
        ...album,
        albumArtists: album.albumArtists.map(
          (albumArtist) => albumArtist.artist,
        ),
      })),
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
      })),
    );

  return { tracks, artists, albums };
};

export const libraryRouter = router({
  list: publicProcedure.query(async () => {
    return assembleLibrary();
  }),
  pictures: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      const track = await db.query.tracks.findFirst({
        where: eq(tracksTable.id, id),
      });

      if (!track || !track.path) {
        return [];
      }
      const pictures = await getPictures(track?.path);

      return pictures?.map((picture) => ({
        ...picture,
        data: undefined,
        imgSrc: `data:${picture.format};base64,${uint8ArrayToBase64(picture.data)}`,
      }));
    }),
});

// export type definition of API
export type LibraryRouter = typeof libraryRouter;
