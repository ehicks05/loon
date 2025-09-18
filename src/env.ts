import { z } from 'zod';

const envSchema = z.object({
	APP_CONTACT_EMAIL: z.string(),

	BETTER_AUTH_SECRET: z.string(),
	BETTER_AUTH_URL: z.string(),

	// CLERK_PUBLISHABLE_KEY: z.string(),

	CLOUDINARY_API_KEY: z.string(),
	CLOUDINARY_API_SECRET: z.string(),
	CLOUDINARY_CLOUD: z.string(),

	DATABASE_URL: z.string(),

	GITHUB_CLIENT_ID: z.string(),
	GITHUB_CLIENT_SECRET: z.string(),

	LAST_FM_API_KEY: z.string(),

	// NODE_ENV: z.enum(['development', 'production']),

	SPOTIFY_CLIENT_ID: z.string(),
	SPOTIFY_CLIENT_SECRET: z.string(),
});

const env = envSchema.parse(process.env);

export { env };
