import { db } from "../../db.js";
import { runLibrarySyncTask } from "../../services/library_sync/index.js";
import { listMediaFiles } from "../../utils/files.js";
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
});

// export type definition of API
export type SystemRouter = typeof systemRouter;
