import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { playlists } from "../drizzle/schema";
import { publicProcedure, router } from "./trpc";

export const playlistRouter = router({
  list: publicProcedure.query(async () => {
    return db.select().from(playlists);
  }),
  getById: publicProcedure.input(z.number()).query(async ({ input }) => {
    return db.select().from(playlists).where(eq(playlists.id, input));
  }),

  create: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    return db.select().from(playlists).where(eq(playlists.id, input));
  }),
  delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    return db.select().from(playlists).where(eq(playlists.id, input));
  }),
  clone: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    return db.select().from(playlists).where(eq(playlists.id, input));
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
