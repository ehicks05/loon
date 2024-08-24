import { eq } from "drizzle-orm";
import { uniqBy } from "lodash-es";
import pMap from "p-map";
import { db } from "../../db.js";
import {
  album_artists,
  albums,
  artists,
  system_status,
  track_artists,
  tracks,
} from "../../drizzle/main.js";
import { listMediaFiles } from "../../utils/files.js";
import { musicBrainz } from "../musicbrainz/client.js";
import {
  type LoonItemTypes,
  fetchImages,
  imageCache,
  toFullAndThumb,
} from "../spotify/index.js";
import type {
  AlbumArtistInput,
  AlbumInput,
  ArtistInput,
  ArtistWithAlbumArtists,
  TrackArtistInput,
  TrackInput,
} from "../types.js";
import { clearLibraryCache } from "./fetch.js";
import { parseMediaFile } from "./metadata.js";

export interface TrackInputBundle {
  track: TrackInput;
  trackArtists: TrackArtistInput[];
}

type ParsedMediaFile = Awaited<ReturnType<typeof parseMediaFile>>;

const isParsed = (input: ParsedMediaFile | null) => !!input;

const parseMediaFiles = async (mediaFiles: string[]) => {
  const results = await pMap(mediaFiles, parseMediaFile, { concurrency: 8 });
  const parsedMediaFiles = results.filter(isParsed);

  const tracks = parsedMediaFiles.map((o) => o.track);
  const artists = parsedMediaFiles.flatMap((o) => o.artists);
  const albums = parsedMediaFiles.map((o) => o?.album);
  const trackArtists = parsedMediaFiles.flatMap((o) => o?.trackArtists);
  const albumArtists = parsedMediaFiles.flatMap((o) => o?.albumArtists);

  return {
    tracks: uniqBy(tracks, ({ id }) => id),
    artists: uniqBy(artists, ({ id }) => id),
    albums: uniqBy(albums, ({ id }) => id),
    trackArtists,
    albumArtists,
  };
};

const attachArtistName = async (_artist: ArtistInput) => {
  const mbArtist = await musicBrainz.lookup("artist", _artist.id);
  if (mbArtist === null) {
    console.log(_artist);
  }
  const artist = { ..._artist, name: mbArtist.name };
  return artist;
};

const upsertArtist = async (artist: ArtistInput) => {
  const results = await db
    .insert(artists)
    .values(artist)
    .onConflictDoUpdate({
      target: artists.id,
      set: artist,
    })
    .returning();
  const result = results[0];
  return result;
};

const upsertAlbum = async (album: AlbumInput) => {
  const results = await db
    .insert(albums)
    .values(album)
    .onConflictDoUpdate({
      target: albums.id,
      set: album,
    })
    .returning();
  const result = results[0];
  return result;
};

const upsertTrack = async (track: TrackInput) => {
  const results = await db
    .insert(tracks)
    .values(track)
    .onConflictDoUpdate({
      target: tracks.id,
      set: track,
    })
    .returning();
  const result = results[0];
  return result;
};

const upsertTrackArtist = async (trackArtist: TrackArtistInput) => {
  const results = await db
    .insert(track_artists)
    .values(trackArtist)
    .onConflictDoUpdate({
      target: [track_artists.trackId, track_artists.artistId],
      set: trackArtist,
    })
    .returning();
  const result = results[0];
  return result;
};

const upsertAlbumArtist = async (albumArtist: AlbumArtistInput) => {
  const results = await db
    .insert(album_artists)
    .values(albumArtist)
    .onConflictDoUpdate({
      target: [album_artists.albumId, album_artists.artistId],
      set: albumArtist,
    })
    .returning();
  const result = results[0];
  return result;
};

const updateImages = async (artist: ArtistWithAlbumArtists) => {
  const imageQueries = getUniqueImageQueries([artist]);
  const [artistImages, ...albumImages] = imageQueries
    .map((query) => imageCache[query.itemType][query.q] || [])
    .map((images) => toFullAndThumb(images));

  const artistUpdate = {
    image: artistImages?.full?.url,
    imageThumb: artistImages?.thumb?.url,
  };

  if (artistUpdate.image || artistUpdate.imageThumb) {
    await db
      .update(artists)
      .set(artistUpdate)
      .where(eq(artists.id, artist.id))
      .returning();
  }

  await Promise.all(
    artist.albumArtists.map(async (albumArtist, i) => {
      const images = albumImages[i];
      const update = {
        image: images?.full?.url,
        imageThumb: images?.thumb?.url,
      };

      if (update.image || update.image) {
        await db
          .update(albums)
          .set(update)
          .where(eq(albums.id, albumArtist.album.id));
      }
    }),
  );
};

const getUniqueImageQueries = (artists: ArtistWithAlbumArtists[]) =>
  uniqBy(
    artists.flatMap((artist) => [
      { itemType: "artist" as LoonItemTypes, q: artist.name },
      ...artist.albumArtists.map((albumArtist) => ({
        itemType: "album" as LoonItemTypes,
        q: `${artist.name} ${albumArtist.album.name}`,
      })),
    ]),
    (o) => `${o.itemType}:${o.q}`,
  );

export const syncLibrary = async () => {
  const start = new Date();
  console.log("starting sync");
  // get music file listing
  const systemSettings = await db.query.system_settings.findFirst();
  if (!systemSettings) {
    throw new Error("missing systemSettings");
  }
  console.log("listing media files");
  const mediaFiles = await listMediaFiles(systemSettings.musicFolder);
  console.log("parsing media files to db inputs");
  const parsedMediaFiles = await parseMediaFiles(mediaFiles);

  if (systemSettings.syncDb) {
    console.log("fetching artist names from musicBrainz");
    const artists = await pMap(parsedMediaFiles.artists, attachArtistName, {
      concurrency: 1,
    });

    console.log("saving to the db");
    // upsert artists
    await pMap(artists, upsertArtist, { concurrency: 8 });
    // upsert albums
    await pMap(parsedMediaFiles.albums, upsertAlbum, { concurrency: 8 });
    // upsert tracks
    await pMap(parsedMediaFiles.tracks, upsertTrack, { concurrency: 8 });
    // upsert trackArtists
    await pMap(parsedMediaFiles.trackArtists, upsertTrackArtist, {
      concurrency: 8,
    });
    // upsert albumArtists
    await pMap(parsedMediaFiles.albumArtists, upsertAlbumArtist, {
      concurrency: 8,
    });
  }

  if (systemSettings.syncImages) {
    const artists = await db.query.artists.findMany({
      with: { albumArtists: { with: { album: true } } },
    });
    console.log("fetching images");
    const uniqueImageQueries = getUniqueImageQueries(artists);
    await pMap(uniqueImageQueries, fetchImages, { concurrency: 2 });

    console.log("saving image urls to db");
    await pMap(artists, updateImages, { concurrency: 64 });
  }

  const duration = new Date().getTime() - start.getTime();
  console.log(`finished sync in ${duration / 1000} seconds`);
};

export const runLibrarySyncTask = async () => {
  const status = await db.query.system_status.findFirst();
  if (!status) {
    return { success: false, message: "Missing systemStatus" };
  }

  if (status.isSyncing) {
    return { success: false, message: "Syncing in progress" };
  }

  await db.update(system_status).set({ isSyncing: true });

  try {
    await syncLibrary();
  } catch (e) {
    console.log(e);
  } finally {
    clearLibraryCache();
  }

  await db.update(system_status).set({ isSyncing: false });
  return { success: true, message: "Sync complete" };
};
