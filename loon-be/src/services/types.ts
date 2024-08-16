import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type {
  tracks,
  track_artists,
  artists,
  albums,
  album_artists,
} from "../drizzle/main.js";

export type TrackInput = InferInsertModel<typeof tracks>;
export type TrackSelect = InferSelectModel<typeof tracks>;

export type AlbumArtistInput = InferInsertModel<typeof album_artists>;
export type AlbumArtistSelect = InferSelectModel<typeof album_artists>;
export type TrackArtistInput = InferInsertModel<typeof track_artists>;
export type ArtistInput = InferInsertModel<typeof artists>;
export type AlbumInput = InferInsertModel<typeof albums>;

export type ArtistSelect = InferSelectModel<typeof artists>;
export type AlbumSelect = InferSelectModel<typeof artists>;

export interface AlbumArtistWithAlbum extends AlbumArtistSelect {
  album: AlbumSelect;
}

export interface ArtistWithAlbumArtists extends ArtistSelect {
  albumArtists: AlbumArtistWithAlbum[];
}
