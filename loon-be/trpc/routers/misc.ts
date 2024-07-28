import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { system_settings } from "../../drizzle/main";
import { publicProcedure, router } from "../trpc";

export const miscRouter = router({
  health: publicProcedure.query(() => "ok"),
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  systemSettings: publicProcedure.query(async () => {
    return db.query.system_settings.findFirst();
  }),

  setSystemSettings: publicProcedure
    .input(
      z.object({
        dataFolder: z.string(),
        lastFmApiKey: z.string(),
        musicFolder: z.string(),
        spotifyClientId: z.string(),
        spotifyClientSecret: z.string(),
        transcodeFolder: z.string(),
        transcodeQuality: z.string(),
        watchFiles: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const systemSettings = (
        await db
          .update(system_settings)
          .set(input)
          .where(eq(system_settings.id, "system"))
          .returning()
      )[0];
      return systemSettings;
    }),
});

// export type definition of API
export type MiscRouter = typeof miscRouter;
