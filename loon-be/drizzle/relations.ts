import { relations } from "drizzle-orm/relations";
import { playlist_tracks, playlists, tracks, user_state } from "./schema";
import {
  loon_roles,
  loon_users,
  spring_session,
  spring_session_attributes,
  user_roles,
} from "./spring";

export const userStateRelations = relations(user_state, ({ one }) => ({
  loonUser: one(loon_users, {
    fields: [user_state.id],
    references: [loon_users.id],
  }),
}));

export const loonUsersRelations = relations(loon_users, ({ many }) => ({
  userStates: many(user_state),
  userRoles: many(user_roles),
}));

export const userRolesRelations = relations(user_roles, ({ one }) => ({
  loonRole: one(loon_roles, {
    fields: [user_roles.role_id],
    references: [loon_roles.id],
  }),
  loonUser: one(loon_users, {
    fields: [user_roles.user_id],
    references: [loon_users.id],
  }),
}));

export const loonRolesRelations = relations(loon_roles, ({ many }) => ({
  userRoles: many(user_roles),
}));

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

export const springSessionAttributesRelations = relations(
  spring_session_attributes,
  ({ one }) => ({
    spring_session: one(spring_session, {
      fields: [spring_session_attributes.session_primary_id],
      references: [spring_session.primary_id],
    }),
  }),
);

export const springSessionRelations = relations(spring_session, ({ many }) => ({
  spring_session_attributes: many(spring_session_attributes),
}));
