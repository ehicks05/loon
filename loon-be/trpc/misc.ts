import trpc, { initTRPC } from "@trpc/server";
import { eq, not } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { tracks } from "../drizzle/schema";

export const t = initTRPC.create();

export const miscRouter = t.router({
  health: t.procedure.query(() => "ok"),

  tracks: t.procedure.query(async () => {
    const result = await db.select().from(tracks);
    // .where(not(eq(tracks.music_brainz_track_id, "")));
    return {
      tracks: result,
    };
  }),

  // builds JSON of all the nested folders and files
  trackPaths: t.procedure.query(() => {
    return {
      tracksPaths: "todo",
    };
  }),
});

// export type definition of API
export type MiscRouter = typeof miscRouter;
