import {
  bigint,
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { userTable } from "./lucia.js";

export const system_settings = pgTable("system_settings", {
  id: text("id").primaryKey().default("system"),
  musicFolder: text("music_folder").notNull().default(""),
  syncDb: boolean("sync_db").notNull().default(false),
  syncImages: boolean("sync_images").notNull().default(false),
});

export const system_status = pgTable("system_status", {
  id: text("id").primaryKey().default("status"),
  isSyncing: boolean("is_syncing").notNull().default(false),
});

export const playlists = pgTable("playlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  favorites: boolean("favorites").notNull().default(false),
  name: text("name").notNull(),
  queue: boolean("queue").notNull().default(false),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const tracks = pgTable("tracks", {
  id: text("id").primaryKey(),
  albumId: text("album_id")
    .notNull()
    .references(() => albums.id, { onDelete: "no action" }),
  discNumber: integer("disc_number"),
  duration: bigint("duration", { mode: "number" }).notNull(),
  formattedDuration: text("formatted_duration").notNull(),
  missingFile: boolean("missing_file").notNull().default(false),
  path: text("path").notNull(),
  title: text("title").notNull(),
  trackGainLinear: text("track_gain_linear").notNull(),
  trackNumber: integer("track_number"),
  trackPeak: text("track_peak").notNull(),
});

export const artists = pgTable("artists", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull().default(""),
  imageThumb: text("image_thumb").notNull().default(""),
});

export const albums = pgTable("albums", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull().default(""),
  imageThumb: text("image_thumb").notNull().default(""),
});

export const track_artists = pgTable(
  "track_artists",
  {
    trackId: text("track_id")
      .references(() => tracks.id, {
        onDelete: "cascade",
      })
      .notNull(),
    artistId: text("artist_id").notNull(),
    index: integer("index").notNull(),
  },
  (table) => {
    return {
      track_artists_pkey: primaryKey({
        columns: [table.trackId, table.artistId],
        name: "track_artists_pkey",
      }),
    };
  },
);

export const album_artists = pgTable(
  "album_artists",
  {
    albumId: text("album_id")
      .references(() => albums.id, {
        onDelete: "cascade",
      })
      .notNull(),
    artistId: text("artist_id").notNull(),
    index: integer("index").notNull(),
  },
  (table) => {
    return {
      album_artists_pkey: primaryKey({
        columns: [table.albumId, table.artistId],
        name: "album_artists_pkey",
      }),
    };
  },
);

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
