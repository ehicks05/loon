import { eq } from "drizzle-orm";
import pMap from "p-map";
import { db } from "../../db";
import { system_settings, tracks } from "../../drizzle/main";
import { listMediaFiles } from "../../utils/files";
import { getTrackInput } from "../../utils/metadata";
import { adminProcedure, router } from "../trpc";

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

  if (systemSettings.isSyncing) {
    return { success: false, message: "Syncing in progress" };
  }

  await db.update(system_settings).set({ isSyncing: true });

  // scan music folder
  const mediaFiles = await listMediaFiles(systemSettings.musicFolder);

  try {
    const result = await pMap(mediaFiles, processFile, { concurrency: 4 });
  } catch (e) {
    console.log(e);
  }

  await db.update(system_settings).set({ isSyncing: false });
  return { success: true, message: "Scan complete" };
};

export const systemRouter = router({
  listMusicFolder: adminProcedure.query(async () => {
    const systemSettings = await db.query.system_settings.findFirst();
    if (!systemSettings) {
      return { mediaFiles: [] };
    }

    const mediaFiles = await listMediaFiles(systemSettings.musicFolder);

    return { mediaFiles };
  }),

  runLibrarySync: adminProcedure.mutation(async () => {
    return syncLibrary();
  }),

  librarySyncStatus: adminProcedure.query(async () => {
    const systemSettings = await db.query.system_settings.findFirst();

    return { inProgress: systemSettings?.isSyncing || false };
  }),
});

// export type definition of API
export type SystemRouter = typeof systemRouter;
