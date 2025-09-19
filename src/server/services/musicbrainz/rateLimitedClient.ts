import querystring from 'node:querystring';
import pThrottle, { type ThrottledFunction } from 'p-throttle';
import { BASE_URL, RATE_LIMIT } from './constants';
import { FetchError } from './error';

type ThrottledFetch = ThrottledFunction<
	(
		path: string,
		params?: Record<string, string | number | boolean>,
		init?: RequestInit,
	) => Promise<{ data: unknown }>
>;
let client: ThrottledFetch;

export interface ThrottledClientParams {
	limit?: number;
	interval?: number;
}

interface CreateFetchParams {
	baseURL: string;
}

const createFetch =
	({ baseURL }: CreateFetchParams) =>
	async (
		path: string,
		params?: Record<string, string | number | boolean>,
		init?: RequestInit,
	) => {
		const qs = querystring.stringify(params);
		const response = await fetch(`${baseURL}${path}?${qs}`, { ...init });
		if (!response.ok) {
			throw new FetchError(response.statusText, { path, params });
		}
		const data = await response.json();
		return { data };
	};

const getClient = ({
	limit = RATE_LIMIT.LIMIT,
	interval = RATE_LIMIT.INTERVAL_MS,
}: ThrottledClientParams) => {
	if (client) return client;
	const _client = createFetch({ baseURL: BASE_URL });
	const throttle = pThrottle({ limit, interval });
	client = throttle(_client);
	return client;
};

export { client, getClient };
