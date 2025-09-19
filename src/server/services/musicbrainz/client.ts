import { BASE_URL, HEADERS, PARAMS, RATE_LIMIT } from './constants.js';
import { client, getClient } from './rateLimitedClient.js';
import type { IArtist } from './types.js';

getClient({ limit: RATE_LIMIT.LIMIT, interval: RATE_LIMIT.INTERVAL_MS });

export const musicBrainz = {
	lookup: async (entity: 'artist', id: string) => {
		const url = `/${entity}/${id}`;
		const response = await client(url, PARAMS, HEADERS);

		const json = response.data as IArtist;
		return json;
	},
};
