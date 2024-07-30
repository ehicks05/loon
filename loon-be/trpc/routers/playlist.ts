import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { playlist_tracks, playlists } from "../../drizzle/main";
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
    .input(z.object({ name: z.string(), trackIds: z.array(z.string()) }))
    .mutation(async ({ ctx: { user }, input: { name, trackIds } }) => {
      const results = await db
        .insert(playlists)
        .values({ name, userId: user.id, favorites: false, queue: false })
        .returning();
      const newPlaylist = results[0];

      // create playlistTracks
      const playlistTracks = trackIds.map((trackId, index) => ({
        playlistId: newPlaylist.id,
        trackId,
        index,
      }));
      await db.insert(playlist_tracks).values(playlistTracks);

      return newPlaylist;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx: { user }, input }) => {
      const playlist = await db.query.playlists.findFirst({
        where: eq(playlists.id, input),
      });
      if (!playlist) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (user.id !== playlist.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return db.delete(playlists).where(eq(playlists.id, input));
    }),

  clone: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx: { user }, input }) => {
      const playlist = await db.query.playlists.findFirst({
        where: eq(playlists.id, input),
      });
      if (!playlist) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (user.id !== playlist.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const { id, ...values } = playlist;
      return db.insert(playlists).values({ id: "TODO", ...values });
    }),

  addOrModify: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      return db.select().from(playlists).where(eq(playlists.id, input));
    }),

  dragAndDrop: protectedProcedure
    .input(
      z.object({
        playlistId: z.string(),
        oldIndex: z.number(),
        newIndex: z.number(),
      }),
    )
    .mutation(
      async ({ ctx: { user }, input: { playlistId, oldIndex, newIndex } }) => {
        const playlist = await db.query.playlists.findFirst({
          where: eq(playlists.id, playlistId),
        });
        if (!playlist) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (user.id !== playlist.userId) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        // handle the move of playlistTrack at oldIndex to newIndex

        return "ok";
      },
    ),
});

// export type definition of API
export type PlaylistRouter = typeof playlistRouter;
