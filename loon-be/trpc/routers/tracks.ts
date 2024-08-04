import { asc } from "drizzle-orm";
import { db } from "../../db";
import { tracks } from "../../drizzle/main";
import { publicProcedure, router } from "../trpc";

export const tracksRouter = router({
  list: publicProcedure.query(async () => {
    const result = await db
      .select()
      .from(tracks)
      .orderBy(asc(tracks.artist), asc(tracks.album), asc(tracks.title));
    return result;
  }),
});

// export type definition of API
export type TracksRouter = typeof tracksRouter;
