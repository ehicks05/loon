import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
// @ts-ignore
import type { AppRouter } from "../../../loon-be/trpc/router";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type User = RouterOutput["misc"]["me"];

export type RawTrackResponse = RouterOutput["tracks"]["list"][number];
export type Track = RawTrackResponse & { formattedDuration: string };
export type Playlist = RouterOutput["playlist"]["list"][number];
export type PlaylistTrack =
  RouterOutput["playlist"]["list"][number]["playlistTracks"][number];

export type SystemSettings = RouterOutput["misc"]["systemSettings"];
