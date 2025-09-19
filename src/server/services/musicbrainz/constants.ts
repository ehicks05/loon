import { env } from '@/env.js';

export const BASE_URL = 'https://musicbrainz.org/ws/2';
export const RATE_LIMIT = { LIMIT: 1, INTERVAL_MS: 1000 };

const APP_NAME = 'loon';
const APP_VERSION = '0.1.0';
const APP_CONTACT = env.APP_CONTACT_EMAIL;
const userAgent = `${APP_NAME}/${APP_VERSION} (${APP_CONTACT})`;
export const HEADERS = {
	headers: { 'User-Agent': userAgent },
};

export const PARAMS = { fmt: 'json' };
