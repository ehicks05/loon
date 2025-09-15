import type { AppRouter } from '@ehicks05/loon-be/router';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export type LibraryResponse = RouterOutput['library']['list'];

export type User = RouterOutput['misc']['me'];
export type SystemSettings = RouterOutput['misc']['systemSettings'];

export type Playlist = RouterOutput['playlist']['list'][number];
export type PlaylistTrack =
	RouterOutput['playlist']['list'][number]['playlistTracks'][number];
