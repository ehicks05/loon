import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { playlists } from "../drizzle/schema";
import { publicProcedure, router } from "./trpc";

export const playlistRouter = router({
  list: publicProcedure.query(async ({ ctx: { user } }) => {
    console.log({ user });
    return db.query.playlists.findMany({
      with: {
        playlistTracks: true,
      },
    });
  }),

  getById: publicProcedure.input(z.number()).query(async ({ input }) => {
    return db.select().from(playlists).where(eq(playlists.id, input));
  }),

  create: publicProcedure
    .input(z.object({ id: z.number(), name: z.string(), userId: z.number() }))
    .mutation(async ({ input: { id, name, userId } }) => {
      return db
        .insert(playlists)
        .values({ id, name, userId, favorites: false, queue: false });
    }),

  delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    return db.delete(playlists).where(eq(playlists.id, input));
  }),

  clone: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    const original = await db
      .select()
      .from(playlists)
      .where(eq(playlists.id, input))[0];
    const { id, ...values } = original;
    return db.insert(playlists).values(values);
  }),

  addOrModify: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    return db.select().from(playlists).where(eq(playlists.id, input));
  }),

  dragAndDrop: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    return db.select().from(playlists).where(eq(playlists.id, input));
  }),
});

// export type definition of API
export type PlaylistRouter = typeof playlistRouter;
