import type { InferRouterInputs, InferRouterOutputs } from '@orpc/server';
import type router from './router/index';

export type Inputs = InferRouterInputs<typeof router>;
export type Outputs = InferRouterOutputs<typeof router>;

export type LibraryResponse = Outputs['library'];

export type User = Outputs['misc']['me'];
export type SystemSettings = Outputs['misc']['systemSettings'];

export type Playlist = Outputs['playlist']['list'][number];
export type PlaylistTrack =
	Outputs['playlist']['list'][number]['playlistTracks'][number];
