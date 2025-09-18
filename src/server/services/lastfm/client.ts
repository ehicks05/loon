import { env } from '../../../env.js';
import { AlbumInfoSchema, ArtistInfoSchema } from './types.js';

const DEFAULT_PARAMS = {
	api_key: env.LAST_FM_API_KEY,
	format: 'json',
};

const BASE_URL = 'https://ws.audioscrobbler.com/2.0';

const cache: Record<string, unknown> = {};

const client = async (_params: Record<string, string>) => {
	const params = new URLSearchParams({ ...DEFAULT_PARAMS, ..._params });
	const url = `${BASE_URL}/?${params.toString()}`;
	if (cache[url]) {
		return cache[url];
	}

	const response = await fetch(`${BASE_URL}/?${params.toString()}`);
	const json = await response.json();

	cache[url] = json;

	return json;
};

export const lastFm = {
	artist: {
		getInfo: async ({ artist }: { artist: string }) => {
			const method = 'artist.getinfo';
			const params = { method, artist };
			const json = await client(params);
			return ArtistInfoSchema.parse(json).artist;
		},
	},
	album: {
		getInfo: async ({ artist, album }: { artist: string; album: string }) => {
			const method = 'album.getinfo';
			const params = { method, artist, album };
			const json = await client(params);
			return AlbumInfoSchema.parse(json).album;
		},
	},
};
