import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { env } from '../../../env.js';

const spotify = SpotifyApi.withClientCredentials(
	env.SPOTIFY_CLIENT_ID,
	env.SPOTIFY_CLIENT_SECRET,
	undefined,
	{
		afterRequest(url, _, response) {
			if (response.status !== 200) {
				console.log(`${url} - ${response.status}`);
				console.log(response.headers);
			}
		},
	},
);

export { spotify };
