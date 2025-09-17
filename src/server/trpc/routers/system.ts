import { db } from "../../../../src/server/db.js";
import { albums, artists, tracks } from "../../../../src/server/drizzle/main.js";
import { runLibrarySyncTask } from "../../services/library/sync.js";
import { listMediaFiles } from "../../../../src/server/utils/files.js";
import { adminProcedure, router } from "../trpc.js";

export const systemRouter = router({
  listMusicFolder: adminProcedure.query(async () => {
    const systemSettings = await db.query.system_settings.findFirst();
    if (!systemSettings) {
      return { mediaFiles: [] };
    }

    const mediaFiles = await listMediaFiles(systemSettings.musicFolder);

    return { mediaFiles };
  }),

  syncLibrary: adminProcedure.mutation(async () => {
    // don't await
    runLibrarySyncTask();
    return;
  }),

  status: adminProcedure.query(async () => {
    const status = await db.query.system_status.findFirst();

    return { inProgress: status?.isSyncing || false };
  }),

  clearLibrary: adminProcedure.mutation(async () => {
    await db.delete(tracks);
    await db.delete(artists);
    await db.delete(albums);

    // todo: cascade rules

    return { success: true };
  }),
});

// export type definition of API
export type SystemRouter = typeof systemRouter;
