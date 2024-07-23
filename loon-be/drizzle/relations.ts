import { relations } from "drizzle-orm/relations";
import { loon_users, user_state, loon_roles, user_roles, playlists, playlist_tracks, tracks, spring_session, spring_session_attributes } from "./schema";

export const user_stateRelations = relations(user_state, ({one}) => ({
	loon_user: one(loon_users, {
		fields: [user_state.id],
		references: [loon_users.id]
	}),
}));

export const loon_usersRelations = relations(loon_users, ({many}) => ({
	user_states: many(user_state),
	user_roles: many(user_roles),
}));

export const user_rolesRelations = relations(user_roles, ({one}) => ({
	loon_role: one(loon_roles, {
		fields: [user_roles.role_id],
		references: [loon_roles.id]
	}),
	loon_user: one(loon_users, {
		fields: [user_roles.user_id],
		references: [loon_users.id]
	}),
}));

export const loon_rolesRelations = relations(loon_roles, ({many}) => ({
	user_roles: many(user_roles),
}));

export const playlist_tracksRelations = relations(playlist_tracks, ({one}) => ({
	playlist: one(playlists, {
		fields: [playlist_tracks.playlist_id],
		references: [playlists.id]
	}),
	track: one(tracks, {
		fields: [playlist_tracks.track_id],
		references: [tracks.id]
	}),
}));

export const playlistsRelations = relations(playlists, ({many}) => ({
	playlist_tracks: many(playlist_tracks),
}));

export const tracksRelations = relations(tracks, ({many}) => ({
	playlist_tracks: many(playlist_tracks),
}));

export const spring_session_attributesRelations = relations(spring_session_attributes, ({one}) => ({
	spring_session: one(spring_session, {
		fields: [spring_session_attributes.session_primary_id],
		references: [spring_session.primary_id]
	}),
}));

export const spring_sessionRelations = relations(spring_session, ({many}) => ({
	spring_session_attributes: many(spring_session_attributes),
}));