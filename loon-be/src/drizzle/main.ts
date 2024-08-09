import {
  bigint,
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { userTable } from "./lucia";

export const system_settings = pgTable("system_settings", {
  id: text("id").primaryKey().notNull().default("system"),
  musicFolder: text("music_folder").notNull().default(""),
  syncImages: boolean("sync_images").notNull().default(false),
});

export const system_status = pgTable("system_status", {
  id: text("id").primaryKey().notNull().default("status"),
  isSyncing: boolean("is_syncing").notNull().default(false),
});

export const playlists = pgTable("playlists", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  favorites: boolean("favorites").notNull().default(false),
  name: text("name").notNull(),
  queue: boolean("queue").notNull().default(false),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const tracks = pgTable("tracks", {
  id: text("id").primaryKey().notNull(),
  album: text("album").notNull(),
  albumArtist: text("album_artist").notNull(),
  artist: text("artist").notNull(),
  discNumber: integer("disc_number"),
  duration: bigint("duration", { mode: "number" }).notNull(),
  missingFile: boolean("missing_file").notNull().default(false),
  musicBrainzTrackId: text("music_brainz_track_id"),
  path: text("path").notNull(),
  spotifyAlbumImage: text("spotify_album_image").notNull().default(""),
  spotifyAlbumImageThumb: text("spotify_album_image_thumb")
    .notNull()
    .default(""),
  spotifyArtistImage: text("spotify_artist_image").notNull().default(""),
  spotifyArtistImageThumb: text("spotify_artist_image_thumb")
    .notNull()
    .default(""),
  title: text("title").notNull(),
  trackGainLinear: text("track_gain_linear").notNull(),
  trackNumber: integer("track_number"),
  trackPeak: text("track_peak").notNull(),
});

export const playlist_tracks = pgTable(
  "playlist_tracks",
  {
    playlistId: uuid("playlist_id")
      .notNull()
      .references(() => playlists.id, { onDelete: "cascade" }),
    trackId: text("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    index: bigint("index", { mode: "number" }).notNull(),
  },
  (table) => {
    return {
      playlist_tracks_pkey: primaryKey({
        columns: [table.playlistId, table.trackId],
        name: "playlist_tracks_pkey",
      }),
    };
  },
);
