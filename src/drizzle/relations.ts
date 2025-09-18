import { relations } from "drizzle-orm/relations";
import {
  album_artists,
  albums,
  artists,
  playlist_tracks,
  playlists,
  track_artists,
  tracks,
} from "./main";

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

export const tracksRelations = relations(tracks, ({ many, one }) => ({
  playlistTracks: many(playlist_tracks),
  trackArtists: many(track_artists),
  album: one(albums, {
    fields: [tracks.albumId],
    references: [albums.id],
  }),
}));

export const trackArtistsRelations = relations(track_artists, ({ one }) => ({
  track: one(tracks, {
    fields: [track_artists.trackId],
    references: [tracks.id],
  }),
  artist: one(artists, {
    fields: [track_artists.artistId],
    references: [artists.id],
  }),
}));

export const artistsRelations = relations(artists, ({ many }) => ({
  albumArtists: many(album_artists),
}));

export const albumsRelations = relations(albums, ({ many }) => ({
  tracks: many(tracks),
  albumArtists: many(album_artists),
}));

export const albumArtistsRelations = relations(album_artists, ({ one }) => ({
  album: one(albums, {
    fields: [album_artists.albumId],
    references: [albums.id],
  }),
  artist: one(artists, {
    fields: [album_artists.artistId],
    references: [artists.id],
  }),
}));
