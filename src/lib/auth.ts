import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { db } from '@/drizzle/db';
import { env } from '@/env';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
	}),
	plugins: [admin()],
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	},
	trustedOrigins: ['https://loon.ehicks.net'],
});
