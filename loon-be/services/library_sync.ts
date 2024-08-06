/*

grab image from spotify, could be an artist or an album

create output filename, art/artist/artist or art/artist/album

upload image bytes and filename to cloudinary

we kept a map of filenamy to cloudinary publicId to use as a cache

 - check cache, return if present
 - otherwise upload to cloudinary, cache the result, and return the id

we saved full size and thumbnail separately - can't cloudinary do that?

*/

import { eq } from "drizzle-orm";
import pMap from "p-map";
import { db } from "../db";
import { tracks } from "../drizzle/main";
import { listMediaFiles } from "../utils/files";
import { getTrackInput } from "../utils/metadata";

const syncMediaFile = async (mediaFile: string) => {
  const trackInput = await getTrackInput(mediaFile);
  if (!trackInput) {
    throw new Error("unable to parse file to a track");
  }

  const track = await db.insert(tracks).values(trackInput).onConflictDoUpdate({
    target: tracks.id,
    set: trackInput,
  });

  const hasImage = false;
  if (!hasImage) {
  }
};

const syncLibrary = async () => {
  // get music file listing
  const systemSettings = await db.query.system_settings.findFirst();
  if (!systemSettings) {
    throw new Error("missing systemSettings");
  }
  const mediaFiles = await listMediaFiles(systemSettings.musicFolder);

  await pMap(mediaFiles, syncMediaFile, { concurrency: 4 });
};
