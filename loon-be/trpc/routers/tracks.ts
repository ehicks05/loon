import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { system_settings, tracks } from "../../drizzle/main";
import { listFiles } from "../../utils/files";
import { getMetadata } from "../../utils/metadata";
import { publicProcedure, router } from "../trpc";

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
