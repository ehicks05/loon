import type { AppRouter } from "@ehicks05/loon-be/router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type LibraryResponse = RouterOutput["library"]["list"];

export type Artist = LibraryResponse["artists"][number];
export type Album = LibraryResponse["albums"][number];
export type Track = LibraryResponse["tracks"][number];

export type User = RouterOutput["misc"]["me"];
export type SystemSettings = RouterOutput["misc"]["systemSettings"];

export type Playlist = RouterOutput["playlist"]["list"][number];
export type PlaylistTrack =
  RouterOutput["playlist"]["list"][number]["playlistTracks"][number];
