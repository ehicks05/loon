import { relations } from "drizzle-orm/relations";
import { playlist_tracks, playlists, tracks } from "./main.js";

export const playlistTracksRelations = relations(
  playlist_tracks,
  ({ one }) => ({
    playlist: one(playlists, {
      fields: [playlist_tracks.playlistId],
      references: [playlists.id],
    }),
    track: one(tracks, {
      fields: [playlist_tracks.trackId],
      references: [tracks.id],
    }),
  }),
);

export const playlistsRelations = relations(playlists, ({ many }) => ({
  playlistTracks: many(playlist_tracks),
}));

export const tracksRelations = relations(tracks, ({ many }) => ({
  playlistTracks: many(playlist_tracks),
}));
