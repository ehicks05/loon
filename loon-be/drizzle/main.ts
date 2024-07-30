import {
  bigint,
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { userTable } from "./lucia";

export const system_settings = pgTable("system_settings", {
  id: text("id").primaryKey().notNull().default("system"),
  dataFolder: text("data_folder").notNull().default(""),
  lastFmApiKey: text("last_fm_api_key").notNull().default(""),
  musicFolder: text("music_folder").notNull().default(""),
  spotifyClientId: text("spotify_client_id").notNull().default(""),
  spotifyClientSecret: text("spotify_client_secret").notNull().default(""),
  transcodeFolder: text("transcode_folder").notNull().default(""),
  transcodeQuality: text("transcode_quality").notNull().default(""),
  watchFiles: boolean("watch_files").notNull().default(false),
  isSyncing: boolean("is_syncing").notNull().default(false),
});

export const playlists = pgTable("playlists", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  favorites: boolean("favorites").notNull().default(false),
  name: text("name").notNull(),
  queue: boolean("queue").notNull().default(false),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
});

export const tracks = pgTable("tracks", {
  id: text("id").primaryKey().notNull(),
  album: varchar("album", { length: 255 }).notNull(),
  albumArtist: varchar("album_artist", { length: 255 }).notNull(),
  albumImageId: varchar("album_image_id", { length: 1000 }),
  albumThumbnailId: varchar("album_thumbnail_id", { length: 1000 }),
  artist: varchar("artist", { length: 255 }).notNull(),
  artistImageId: varchar("artist_image_id", { length: 1000 }),
  artistThumbnailId: varchar("artist_thumbnail_id", { length: 1000 }),
  bitDepth: integer("bit_depth"),
  discNumber: integer("disc_number"),
  duration: bigint("duration", { mode: "number" }).notNull(),
  extension: varchar("extension", { length: 255 }),
  missingFile: boolean("missing_file"),
  musicBrainzTrackId: varchar("music_brainz_track_id", { length: 255 }),
  path: varchar("path", { length: 255 }).notNull(),
  sampleRate: integer("sample_rate"),
  size: bigint("size", { mode: "number" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  trackGain: varchar("track_gain", { length: 255 }).notNull(),
  trackGainLinear: varchar("track_gain_linear", { length: 255 }).notNull(),
  trackNumber: integer("track_number"),
  trackPeak: varchar("track_peak", { length: 255 }).notNull(),
});

export const playlist_tracks = pgTable(
  "playlist_tracks",
  {
    playlistId: uuid("playlist_id")
      .notNull()
      .references(() => playlists.id),
    trackId: text("track_id")
      .notNull()
      .references(() => tracks.id),
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
