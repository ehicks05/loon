import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
// @ts-ignore
import type { AppRouter } from "../../../loon-be/trpc/router";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type User = RouterOutput["misc"]["me"];

export type Track = RouterOutput["tracks"]["list"][number] & {
  formattedDuration: string;
};
export type Playlist = RouterOutput["playlist"]["list"][number];

export type SystemSettings = RouterOutput["misc"]["systemSettings"];
