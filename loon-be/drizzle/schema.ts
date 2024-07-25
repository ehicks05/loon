import {
  bigint,
  boolean,
  char,
  doublePrecision,
  foreignKey,
  index,
  integer,
  pgTable,
  primaryKey,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { loon_users } from "./spring";

export const loon_system = pgTable("loon_system", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  dataFolder: varchar("data_folder", { length: 255 }),
  directoryWatcherEnabled: boolean("directory_watcher_enabled").notNull(),
  instanceName: varchar("instance_name", { length: 255 }),
  lastFmApiKey: varchar("last_fm_api_key", { length: 255 }),
  logonMessage: varchar("logon_message", { length: 255 }),
  musicFolder: varchar("music_folder", { length: 255 }),
  registrationEnabled: boolean("registration_enabled").notNull(),
  spotifyClientId: varchar("spotify_client_id", { length: 255 }),
  spotifyClientSecret: varchar("spotify_client_secret", { length: 255 }),
  transcodeFolder: varchar("transcode_folder", { length: 255 }),
  transcodeQuality: varchar("transcode_quality", { length: 255 }),
});

export const playlists = pgTable("playlists", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  favorites: boolean("favorites"),
  name: varchar("name", { length: 255 }).notNull(),
  queue: boolean("queue"),
  userId: bigint("user_id", { mode: "number" }).notNull(),
});

export const tracks = pgTable("tracks", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
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

export const user_state = pgTable("user_state", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .notNull()
    .references(() => loon_users.id),
  eq1frequency: integer("eq1frequency"),
  eq1gain: integer("eq1gain"),
  eq2frequency: integer("eq2frequency"),
  eq2gain: integer("eq2gain"),
  eq3frequency: integer("eq3frequency"),
  eq3gain: integer("eq3gain"),
  eq4frequency: integer("eq4frequency"),
  eq4gain: integer("eq4gain"),
  muted: boolean("muted"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  selectedPlaylistId: bigint("selected_playlist_id", { mode: "number" }),
  selectedTrackId: varchar("selected_track_id", { length: 255 }),
  shuffle: boolean("shuffle").notNull(),
  theme: varchar("theme", { length: 255 }),
  transcode: boolean("transcode").notNull(),
  volume: doublePrecision("volume"),
});

export const playlist_tracks = pgTable(
  "playlist_tracks",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    playlistId: bigint("playlist_id", { mode: "number" })
      .notNull()
      .references(() => playlists.id),
    trackId: varchar("track_id", { length: 255 })
      .notNull()
      .references(() => tracks.id),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
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
