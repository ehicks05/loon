import { pgTable, bigint, varchar, boolean, integer, unique, foreignKey, doublePrecision, uniqueIndex, index, char, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const loon_system = pgTable("loon_system", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	data_folder: varchar("data_folder", { length: 255 }),
	directory_watcher_enabled: boolean("directory_watcher_enabled").notNull(),
	instance_name: varchar("instance_name", { length: 255 }),
	last_fm_api_key: varchar("last_fm_api_key", { length: 255 }),
	logon_message: varchar("logon_message", { length: 255 }),
	music_folder: varchar("music_folder", { length: 255 }),
	registration_enabled: boolean("registration_enabled").notNull(),
	spotify_client_id: varchar("spotify_client_id", { length: 255 }),
	spotify_client_secret: varchar("spotify_client_secret", { length: 255 }),
	transcode_folder: varchar("transcode_folder", { length: 255 }),
	transcode_quality: varchar("transcode_quality", { length: 255 }),
});

export const playlists = pgTable("playlists", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	favorites: boolean("favorites"),
	name: varchar("name", { length: 255 }).notNull(),
	queue: boolean("queue"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	user_id: bigint("user_id", { mode: "number" }).notNull(),
});

export const tracks = pgTable("tracks", {
	id: varchar("id", { length: 255 }).primaryKey().notNull(),
	album: varchar("album", { length: 255 }).notNull(),
	album_artist: varchar("album_artist", { length: 255 }).notNull(),
	album_image_id: varchar("album_image_id", { length: 1000 }),
	album_thumbnail_id: varchar("album_thumbnail_id", { length: 1000 }),
	artist: varchar("artist", { length: 255 }).notNull(),
	artist_image_id: varchar("artist_image_id", { length: 1000 }),
	artist_thumbnail_id: varchar("artist_thumbnail_id", { length: 1000 }),
	bit_depth: integer("bit_depth"),
	disc_number: integer("disc_number"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	duration: bigint("duration", { mode: "number" }).notNull(),
	extension: varchar("extension", { length: 255 }),
	missing_file: boolean("missing_file"),
	music_brainz_track_id: varchar("music_brainz_track_id", { length: 255 }),
	path: varchar("path", { length: 255 }).notNull(),
	sample_rate: integer("sample_rate"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	size: bigint("size", { mode: "number" }).notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	track_gain: varchar("track_gain", { length: 255 }).notNull(),
	track_gain_linear: varchar("track_gain_linear", { length: 255 }).notNull(),
	track_number: integer("track_number"),
	track_peak: varchar("track_peak", { length: 255 }).notNull(),
});

export const loon_roles = pgTable("loon_roles", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	role: varchar("role", { length: 255 }).notNull(),
},
(table) => {
	return {
		uk_h1mqq0tbxl1hvc4bnkwde9ik9: unique("uk_h1mqq0tbxl1hvc4bnkwde9ik9").on(table.role),
	}
});

export const loon_users = pgTable("loon_users", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull(),
	full_name: varchar("full_name", { length: 255 }).notNull(),
	password: varchar("password", { length: 255 }).notNull(),
	username: varchar("username", { length: 255 }).notNull(),
});

export const user_state = pgTable("user_state", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint("id", { mode: "number" }).primaryKey().notNull().references(() => loon_users.id),
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
	selected_playlist_id: bigint("selected_playlist_id", { mode: "number" }),
	selected_track_id: varchar("selected_track_id", { length: 255 }),
	shuffle: boolean("shuffle").notNull(),
	theme: varchar("theme", { length: 255 }),
	transcode: boolean("transcode").notNull(),
	volume: doublePrecision("volume"),
});

export const spring_session = pgTable("spring_session", {
	primary_id: char("primary_id", { length: 36 }).primaryKey().notNull(),
	session_id: char("session_id", { length: 36 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	creation_time: bigint("creation_time", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	last_access_time: bigint("last_access_time", { mode: "number" }).notNull(),
	max_inactive_interval: integer("max_inactive_interval").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expiry_time: bigint("expiry_time", { mode: "number" }).notNull(),
	principal_name: varchar("principal_name", { length: 100 }),
},
(table) => {
	return {
		ix1: uniqueIndex("spring_session_ix1").using("btree", table.session_id),
		ix2: index("spring_session_ix2").using("btree", table.expiry_time),
		ix3: index("spring_session_ix3").using("btree", table.principal_name),
	}
});

export const user_roles = pgTable("user_roles", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	user_id: bigint("user_id", { mode: "number" }).notNull().references(() => loon_users.id),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	role_id: bigint("role_id", { mode: "number" }).notNull().references(() => loon_roles.id),
},
(table) => {
	return {
		user_roles_pkey: primaryKey({ columns: [table.user_id, table.role_id], name: "user_roles_pkey"}),
	}
});

export const playlist_tracks = pgTable("playlist_tracks", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	playlist_id: bigint("playlist_id", { mode: "number" }).notNull().references(() => playlists.id),
	track_id: varchar("track_id", { length: 255 }).notNull().references(() => tracks.id),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	index: bigint("index", { mode: "number" }).notNull(),
},
(table) => {
	return {
		playlist_tracks_pkey: primaryKey({ columns: [table.playlist_id, table.track_id], name: "playlist_tracks_pkey"}),
	}
});

export const spring_session_attributes = pgTable("spring_session_attributes", {
	session_primary_id: char("session_primary_id", { length: 36 }).notNull().references(() => spring_session.primary_id, { onDelete: "cascade" } ),
	attribute_name: varchar("attribute_name", { length: 200 }).notNull(),
	// TODO: failed to parse database type 'bytea'
	// attribute_bytes: binary("attribute_bytes").notNull(),
},
(table) => {
	return {
		spring_session_attributes_pk: primaryKey({ columns: [table.session_primary_id, table.attribute_name], name: "spring_session_attributes_pk"}),
	}
});