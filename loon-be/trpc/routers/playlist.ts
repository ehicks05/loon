import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { playlists } from "../../drizzle/main";
import { protectedProcedure, router } from "../trpc";

export const playlistRouter = router({
  list: protectedProcedure.query(async ({ ctx: { user } }) => {
    return db.query.playlists.findMany({
      with: {
        playlistTracks: true,
      },
      where: eq(playlists.userId, user.id),
    });
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return db.select().from(playlists).where(eq(playlists.id, input));
  }),

  create: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx: { user }, input: { id, name } }) => {
      return db
        .insert(playlists)
        .values({ id, name, userId: user.id, favorites: false, queue: false });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx: { user }, input }) => {
      if (user.id !== input) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return db.delete(playlists).where(eq(playlists.id, input));
    }),

  clone: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    const original = await db.query.playlists.findFirst({
      where: eq(playlists.id, input),
    });
    if (!original) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    const { id, ...values } = original;
    return db.insert(playlists).values({ id: "TODO", ...values });
  }),

  addOrModify: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return db.select().from(playlists).where(eq(playlists.id, input));
    }),

  dragAndDrop: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return db.select().from(playlists).where(eq(playlists.id, input));
    }),
});

// export type definition of API
export type PlaylistRouter = typeof playlistRouter;
