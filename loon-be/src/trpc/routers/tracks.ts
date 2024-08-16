import { asc, eq } from "drizzle-orm";
import { uint8ArrayToBase64 } from "uint8array-extras";
import { z } from "zod";
import { db } from "../../db.js";
import {
  album_artists,
  albums,
  artists,
  track_artists,
  tracks,
} from "../../drizzle/main.js";
import { getPictures } from "../../utils/metadata.js";
import { publicProcedure, router } from "../trpc.js";

export const tracksRouter = router({
  list: publicProcedure.query(async () => {
    const result = await db.query.tracks.findMany({
      with: {
        trackArtists: {
          columns: {},
          with: { artist: true },
          orderBy: [asc(track_artists.index)],
        },
        album: true,
      },
      orderBy: [
        // asc(tracks.artist),
        asc(tracks.albumId),
        asc(tracks.discNumber),
        asc(tracks.trackNumber),
        asc(tracks.title),
      ],
    });
    return result.map((track) => ({
      ...track,
      album: track.album.name,
      artists: track.trackArtists.map((trackArtist) => trackArtist.artist.name),
      trackArtists: undefined,
      spotifyAlbumImage: track.album.image,
      spotifyAlbumImageThumb: track.album.imageThumb,
      spotifyArtistImage: track.trackArtists[0]?.artist.image,
      spotifyArtistImageThumb: track.trackArtists[0]?.artist.imageThumb,
    }));
  }),
  tracks: publicProcedure.query(async () => {
    const result = await db.query.tracks.findMany({
      with: {
        trackArtists: {
          columns: { artistId: true },
          orderBy: [asc(track_artists.index)],
        },
        album: { columns: { id: true } },
      },
      orderBy: [
        // asc(tracks.artist),
        asc(tracks.albumId),
        asc(tracks.discNumber),
        asc(tracks.trackNumber),
        asc(tracks.title),
      ],
    });
    return result;
  }),
  albums: publicProcedure.query(async () => {
    const result = await db.query.albums.findMany({
      with: {
        albumArtists: {
          columns: { artistId: true },
          orderBy: [asc(album_artists.index)],
        },
      },
      orderBy: [asc(albums.name)],
    });
    return result;
  }),
  artists: publicProcedure.query(async () => {
    const result = await db.query.artists.findMany({
      // with: { albumArtists: { with: { album: true } } },
      orderBy: [asc(artists.name)],
    });
    return result;
  }),
  pictures: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      const track = await db.query.tracks.findFirst({
        where: eq(tracks.id, id),
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
export type TracksRouter = typeof tracksRouter;
