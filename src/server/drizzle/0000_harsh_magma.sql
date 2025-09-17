-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "loon_system" (
	"id" bigint PRIMARY KEY NOT NULL,
	"data_folder" varchar(255),
	"directory_watcher_enabled" boolean NOT NULL,
	"instance_name" varchar(255),
	"last_fm_api_key" varchar(255),
	"logon_message" varchar(255),
	"music_folder" varchar(255),
	"registration_enabled" boolean NOT NULL,
	"spotify_client_id" varchar(255),
	"spotify_client_secret" varchar(255),
	"transcode_folder" varchar(255),
	"transcode_quality" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playlists" (
	"id" bigint PRIMARY KEY NOT NULL,
	"favorites" boolean,
	"name" varchar(255) NOT NULL,
	"queue" boolean,
	"user_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tracks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"album" varchar(255) NOT NULL,
	"album_artist" varchar(255) NOT NULL,
	"album_image_id" varchar(1000),
	"album_thumbnail_id" varchar(1000),
	"artist" varchar(255) NOT NULL,
	"artist_image_id" varchar(1000),
	"artist_thumbnail_id" varchar(1000),
	"bit_depth" integer,
	"disc_number" integer,
	"duration" bigint NOT NULL,
	"extension" varchar(255),
	"missing_file" boolean,
	"music_brainz_track_id" varchar(255),
	"path" varchar(255) NOT NULL,
	"sample_rate" integer,
	"size" bigint NOT NULL,
	"title" varchar(255) NOT NULL,
	"track_gain" varchar(255) NOT NULL,
	"track_gain_linear" varchar(255) NOT NULL,
	"track_number" integer,
	"track_peak" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loon_roles" (
	"id" bigint PRIMARY KEY NOT NULL,
	"role" varchar(255) NOT NULL,
	CONSTRAINT "uk_h1mqq0tbxl1hvc4bnkwde9ik9" UNIQUE("role")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "loon_users" (
	"id" bigint PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_state" (
	"id" bigint PRIMARY KEY NOT NULL,
	"eq1frequency" integer,
	"eq1gain" integer,
	"eq2frequency" integer,
	"eq2gain" integer,
	"eq3frequency" integer,
	"eq3gain" integer,
	"eq4frequency" integer,
	"eq4gain" integer,
	"muted" boolean,
	"selected_playlist_id" bigint,
	"selected_track_id" varchar(255),
	"shuffle" boolean NOT NULL,
	"theme" varchar(255),
	"transcode" boolean NOT NULL,
	"volume" double precision
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spring_session" (
	"primary_id" char(36) PRIMARY KEY NOT NULL,
	"session_id" char(36) NOT NULL,
	"creation_time" bigint NOT NULL,
	"last_access_time" bigint NOT NULL,
	"max_inactive_interval" integer NOT NULL,
	"expiry_time" bigint NOT NULL,
	"principal_name" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_roles" (
	"user_id" bigint NOT NULL,
	"role_id" bigint NOT NULL,
	CONSTRAINT "user_roles_pkey" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playlist_tracks" (
	"playlist_id" bigint NOT NULL,
	"track_id" varchar(255) NOT NULL,
	"index" bigint NOT NULL,
	CONSTRAINT "playlist_tracks_pkey" PRIMARY KEY("playlist_id","track_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spring_session_attributes" (
	"session_primary_id" char(36) NOT NULL,
	"attribute_name" varchar(200) NOT NULL,
	"attribute_bytes" "bytea" NOT NULL,
	CONSTRAINT "spring_session_attributes_pk" PRIMARY KEY("session_primary_id","attribute_name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_state" ADD CONSTRAINT "fkjrsgna0pvkx855ke402jj5bec" FOREIGN KEY ("id") REFERENCES "public"."loon_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "fk80rje18iwnqduo6i1dycvdrb" FOREIGN KEY ("role_id") REFERENCES "public"."loon_roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_roles" ADD CONSTRAINT "fkoj8r7iroy1bnu1qtj68judfjc" FOREIGN KEY ("user_id") REFERENCES "public"."loon_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playlist_tracks" ADD CONSTRAINT "fkn9g4py06v2tmrisjdvxvjeb7x" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "playlist_tracks" ADD CONSTRAINT "fkhjkawu4qwjhxcpveah0pymuct" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "spring_session_attributes" ADD CONSTRAINT "spring_session_attributes_fk" FOREIGN KEY ("session_primary_id") REFERENCES "public"."spring_session"("primary_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "spring_session_ix1" ON "spring_session" USING btree ("session_id" bpchar_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "spring_session_ix2" ON "spring_session" USING btree ("expiry_time" int8_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "spring_session_ix3" ON "spring_session" USING btree ("principal_name" text_ops);
*/