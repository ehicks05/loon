import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { playlists } from "../../drizzle/main";
import { publicProcedure, router } from "../trpc";

export const playlistRouter = router({
  list: publicProcedure.query(async ({ ctx: { user } }) => {
    if (!user) {
      return [];
    }

    return db.query.playlists.findMany({
      with: {
        playlistTracks: true,
      },
      where: eq(playlists.userId, user.id),
    });
  }),

  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
    return db.select().from(playlists).where(eq(playlists.id, input));
  }),

  create: publicProcedure
    .input(z.object({ id: z.string(), name: z.string(), userId: z.string() }))
    .mutation(async ({ input: { id, name, userId } }) => {
      return db
        .insert(playlists)
        .values({ id, name, userId, favorites: false, queue: false });
    }),

  delete: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.delete(playlists).where(eq(playlists.id, input));
  }),

  clone: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const original = (
      await db.select().from(playlists).where(eq(playlists.id, input))
    )[0];
    const { id, ...values } = original;
    return db.insert(playlists).values({ id: "TODO", ...values });
  }),

  addOrModify: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.select().from(playlists).where(eq(playlists.id, input));
  }),

  dragAndDrop: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.select().from(playlists).where(eq(playlists.id, input));
  }),
});

// export type definition of API
export type PlaylistRouter = typeof playlistRouter;
