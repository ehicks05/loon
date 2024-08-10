import { eq } from "drizzle-orm";
import { uniqBy } from "lodash-es";
import pMap from "p-map";
import { db } from "../../db.js";
import { system_status, tracks } from "../../drizzle/main.js";
import { listMediaFiles } from "../../utils/files.js";
import { getTrackInput } from "../../utils/metadata.js";
import {
  type LoonItemTypes,
  fetchImages,
  imageCache,
  toFullAndThumb,
} from "../spotify/index.js";
import type { TrackInput } from "../types.js";
import { omitImageFields } from "./utils.js";

const toTrackInputs = async (mediaFiles: string[]) => {
  const results = await pMap(mediaFiles, getTrackInput, { concurrency: 64 });
  const trackInputs = results.filter(
    (result): result is TrackInput => !!result,
  );
  return trackInputs;
};

const updateTrack = async (trackInput: TrackInput) => {
  // upsert, but if it already exists, leave the imageIds fields alone
  const results = await db
    .insert(tracks)
    .values(trackInput)
    .onConflictDoUpdate({
      target: tracks.id,
      set: omitImageFields(trackInput),
    })
    .returning();
  const track = results[0];
  return track;
};

const updateTrackImage = async (track: TrackInput) => {
  // does the track already have images?
  // if (
  //   track.spotifyArtistImage &&
  //   track.spotifyArtistImageThumb &&
  //   track.spotifyAlbumImage &&
  //   track.spotifyAlbumImageThumb
  // ) {
  //   return;
  // }

  // grab from spotify
  const imageQueries = getUniqueImageQueries([track]);
  const [artistImages, albumImages] = imageQueries
    .map((query) => imageCache[query.itemType][query.q] || [])
    .map((images) => toFullAndThumb(images));

  const update = {
    spotifyArtistImage: artistImages?.full?.url,
    spotifyArtistImageThumb: artistImages?.thumb?.url,
    spotifyAlbumImage: albumImages?.full?.url,
    spotifyAlbumImageThumb: albumImages?.thumb?.url,
  };

  const result = await db
    .update(tracks)
    .set(update)
    .where(eq(tracks.id, track.id))
    .returning();
  return result[0];
};

const getUniqueImageQueries = (tracks: TrackInput[]) =>
  uniqBy(
    tracks.flatMap((track) => [
      { itemType: "artist" as LoonItemTypes, q: track.artist },
      {
        itemType: "album" as LoonItemTypes,
        q: `${track.artist} ${track.album}`,
      },
    ]),
    (o) => `${o.itemType}:${o.q}`,
  );

const cacheImages = async (tracks: TrackInput[]) => {
  const uniqueImageQueries = getUniqueImageQueries(tracks);

  await pMap(uniqueImageQueries, fetchImages, { concurrency: 1 });
};

export const syncLibrary = async () => {
  console.log("starting sync");
  // get music file listing
  const systemSettings = await db.query.system_settings.findFirst();
  if (!systemSettings) {
    throw new Error("missing systemSettings");
  }
  console.log("listing media files");
  const mediaFiles = await listMediaFiles(systemSettings.musicFolder);
  console.log("converting media files to trackInputs");
  const trackInputs = await toTrackInputs(mediaFiles);

  console.log("prewarming image cache");
  await cacheImages(trackInputs);

  console.log("mapping trackInputs onto the db");
  await pMap(trackInputs, updateTrack, { concurrency: 64 });
  console.log("saving image fields");
  await pMap(trackInputs, updateTrackImage, { concurrency: 64 });
  console.log("done");
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
  }

  await db.update(system_status).set({ isSyncing: false });
  return { success: true, message: "Sync complete" };
};
