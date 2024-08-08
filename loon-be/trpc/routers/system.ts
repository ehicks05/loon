import { db } from "../../db";
import { runLibrarySyncTask } from "../../services/library_sync";
import { listMediaFiles } from "../../utils/files";
import { adminProcedure, router } from "../trpc";

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
    // don't await
    runLibrarySyncTask();
    return;
  }),

  librarySyncStatus: adminProcedure.query(async () => {
    const systemSettings = await db.query.system_settings.findFirst();

    return { inProgress: systemSettings?.isSyncing || false };
  }),
});

// export type definition of API
export type SystemRouter = typeof systemRouter;
