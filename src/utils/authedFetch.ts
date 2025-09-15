import { API_URL } from '../../env';

export const authedFetch = (url: string, options?: RequestInit) =>
	fetch(API_URL + url, { ...options, credentials: 'include' });
