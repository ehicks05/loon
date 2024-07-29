import { eq } from "drizzle-orm";
import pMap from "p-map";
import { z } from "zod";
import { db } from "../../db";
import { tracks } from "../../drizzle/main";
import { listFiles } from "../../utils/files";
import { getMetadata, getTrackInput } from "../../utils/metadata";
import { publicProcedure, router } from "../trpc";

const processFile = async (path: string) => {
  const trackFromFile = await getTrackInput(path);
  if (!trackFromFile) {
    console.log(`unable to build track input for ${path}`);
    return null;
  }
  const trackFromDb = await db.query.tracks.findFirst({
    where: eq(tracks.id, trackFromFile?.id),
  });

  //   create and update track records
  if (trackFromDb) {
    // compare them and update if needed?
  } else {
    await db.insert(tracks).values(trackFromFile);
  }

  // find existing art, or grab from spotify api
  //   could be inside metadata or in a file
  // take new art and upload to cloudinary
};

const syncLibrary = async () => {
  const systemSettings = await db.query.system_settings.findFirst();
  if (!systemSettings) {
    return { success: false, message: "Missing systemSettings" };
  }

  // scan music folder
  const mediaFiles = await listFiles(systemSettings.musicFolder);

  const result = await pMap(mediaFiles, processFile, { concurrency: 4 });

  return { success: true, message: "Scan complete" };
};

export const tracksRouter = router({
  list: publicProcedure.query(async () => {
    const result = await db.select().from(tracks);
    return result;
  }),

  // builds JSON of all the nested folders and files
  trackPaths: publicProcedure.query(() => {
    return {
      tracksPaths: "todo",
    };
  }),

  musicFolderSummary: publicProcedure.query(async () => {
    const systemSettings = await db.query.system_settings.findFirst();
    if (!systemSettings) {
      return { mediaFiles: [] };
    }

    const mediaFiles = await listFiles(systemSettings.musicFolder);

    return { mediaFiles };
  }),

  sync: publicProcedure.query(async () => {
    return syncLibrary();
  }),

  scan: publicProcedure.query(async () => {
    const systemSettings = await db.query.system_settings.findFirst();
    if (!systemSettings) {
      return [];
    }

    const { musicFolder } = systemSettings;

    return listFiles(musicFolder);
  }),

  getMetadata: publicProcedure
    .input(z.string())
    .query(async ({ input: id }) => {
      const track = await db.query.tracks.findFirst({
        where: eq(tracks.id, id),
      });
      const path = track?.path;
      if (!path) {
        return undefined;
      }
      return await getMetadata(path);
    }),
});

// export type definition of API
export type TracksRouter = typeof tracksRouter;
