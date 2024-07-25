import { eq, not } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { system_settings, tracks } from "../drizzle/main";
import { publicProcedure, router } from "./trpc";

export const miscRouter = router({
  health: publicProcedure.query(() => "ok"),
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  systemSettings: publicProcedure.query(async () => {
    const systemSettings = (await db.select().from(system_settings))[0];

    return systemSettings;
  }),

  tracks: publicProcedure.query(async () => {
    const result = await db.select().from(tracks);
    return result;
  }),

  // builds JSON of all the nested folders and files
  trackPaths: publicProcedure.query(() => {
    return {
      tracksPaths: "todo",
    };
  }),
});

// export type definition of API
export type MiscRouter = typeof miscRouter;
