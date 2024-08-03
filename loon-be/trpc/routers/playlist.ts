import { TRPCError } from "@trpc/server";
import { and, between, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { playlist_tracks, playlists } from "../../drizzle/main";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const playlistRouter = router({
  list: publicProcedure.query(async ({ ctx: { user } }) => {
    if (!user) {
      return [];
    }
    return db.query.playlists.findMany({
      with: {
        playlistTracks: { orderBy: playlist_tracks.index },
      },
      where: eq(playlists.userId, user.id),
    });
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx: { user }, input }) => {
      const playlist = await db.query.playlists.findFirst({
        with: {
          playlistTracks: { orderBy: playlist_tracks.index },
        },
        where: eq(playlists.id, input),
      });

      if (!playlist) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      if (user.id !== playlist.userId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return playlist;
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

  /**
   * Create a playlist and its playlistTracks.
   */
  insert: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        trackIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx: { user }, input: { name, trackIds } }) => {
      const results = await db
        .insert(playlists)
        .values({ userId: user.id, name })
        .returning();
      const playlist = results[0];

      // create new playlistTracks
      const newPlaylistTracks = trackIds.map((trackId, index) => ({
        playlistId: playlist.id,
        trackId,
        index,
      }));

      await db.insert(playlist_tracks).values(newPlaylistTracks);

      return playlist;
    }),

  /**
   * Update a playlist and its track listing.
   * The incoming trackIds will be considered the desired set for this playlist.
   * Track ordering will be maintained with new tracks added at the end.
   * This endpoint is not meant to manage ordering in general.
   * Use dragAndDrop for reordering.
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        trackIds: z.array(z.string()),
      }),
    )
    .mutation(
      async ({ ctx: { user }, input: { id: playlistId, name, trackIds } }) => {
        const playlist = await db.query.playlists.findFirst({
          where: eq(playlists.id, playlistId),
        });
        if (!playlist) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (user.id !== playlist.userId) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        if (name) {
          await db.update(playlists).set({ name });
        }

        // handle playlistTracks
        const existingPlaylistTracks = await db.query.playlist_tracks.findMany({
          where: eq(playlist_tracks.playlistId, playlistId),
          orderBy: playlist_tracks.index,
        });
        const existingTrackIds = existingPlaylistTracks.map((pt) => pt.trackId);
        const maxExistingIndex = existingPlaylistTracks.length
          ? Math.max(...existingPlaylistTracks.map((pt) => pt.index))
          : 0;

        // keep existing tracks that are also in the input
        const keptPlaylistTracks = existingPlaylistTracks.filter((pt) =>
          trackIds.includes(pt.trackId),
        );

        // create new playlist tracks for input trackIds that aren't present in existing playlist tracks
        const newTrackIds = trackIds.filter(
          (id) => !existingTrackIds.includes(id),
        );
        const newPlaylistTracks = newTrackIds.map((trackId, index) => ({
          playlistId,
          trackId,
          index: maxExistingIndex + index,
        }));

        // combine kept and new playlist tracks, and remove any gaps in their indices
        const updatedPlaylistTracks = [
          ...keptPlaylistTracks,
          ...newPlaylistTracks,
        ].map((pt, index) => ({ ...pt, index }));

        // nuke the playlist's playlist tracks and recreate with out new list
        await db
          .delete(playlist_tracks)
          .where(eq(playlist_tracks.playlistId, playlistId));
        if (updatedPlaylistTracks.length) {
          await db.insert(playlist_tracks).values(updatedPlaylistTracks);
        }

        return { success: "ok" };
      },
    ),

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
        await db.transaction(async (tx) => {
          const playlist = await tx.query.playlists.findFirst({
            where: eq(playlists.id, playlistId),
            with: { playlistTracks: true },
          });
          const selectedPlaylistTrack = playlist?.playlistTracks.find(
            (pt) => pt.index === oldIndex,
          );

          if (!playlist || !selectedPlaylistTrack) {
            throw new TRPCError({ code: "NOT_FOUND" });
          }
          if (user.id !== playlist.userId) {
            throw new TRPCError({ code: "FORBIDDEN" });
          }
          if (oldIndex === newIndex) {
            throw new TRPCError({ code: "BAD_REQUEST" });
          }

          const otherTrackIndexOne =
            newIndex > oldIndex ? oldIndex + 1 : oldIndex - 1;
          const otherTrackIndexTwo = newIndex;

          // move the other tracks one position, in opposite direction of selected track
          await tx
            .update(playlist_tracks)
            .set({
              index:
                newIndex > oldIndex
                  ? sql`${playlist_tracks.index} - 1`
                  : sql`${playlist_tracks.index} + 1`,
            })
            .where(
              and(
                eq(playlist_tracks.playlistId, playlistId),
                between(
                  playlist_tracks.index,
                  Math.min(otherTrackIndexOne, otherTrackIndexTwo),
                  Math.max(otherTrackIndexOne, otherTrackIndexTwo),
                ),
              ),
            );

          // move selected track
          await tx
            .update(playlist_tracks)
            .set({ index: newIndex })
            .where(
              and(
                eq(playlist_tracks.playlistId, playlistId),
                eq(playlist_tracks.trackId, selectedPlaylistTrack.trackId),
              ),
            );
        });

        return { success: "ok" };
      },
    ),
});

// export type definition of API
export type PlaylistRouter = typeof playlistRouter;
