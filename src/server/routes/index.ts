import { generateState, OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import express from 'express';
import { generateIdFromEntropySize } from 'lucia';
import { serializeCookie } from 'oslo/cookie';
import { db } from '../../drizzle/db.js';
import { userTable } from '../drizzle/lucia.js';
import { playlists, tracks } from '../drizzle/main.js';
import { github } from '../lucia/github.js';
import { lucia } from '../lucia/lucia.js';
import { doesFileExist } from '../utils/files.js';
import { validateRequest } from '../utils/validate.js';

const router = express.Router();

router.get('/poll', (_, res) => res.send({ success: true }));

router.get<unknown, unknown, unknown, { id?: string }>(
	'/media',
	async (req, res) => {
		const { id } = req.query;
		if (!id) {
			return res.status(400).send();
		}
		const track = await db.query.tracks.findFirst({ where: eq(tracks.id, id) });
		const path = track?.path;
		if (!path) {
			return res.status(404).send();
		}
		const fileExists = await doesFileExist(path);
		if (!fileExists) {
			return res.status(404).send();
		}
		return res.sendFile(path, { acceptRanges: true });
	},
);

router.get('/login/github', async (_, res) => {
	const state = generateState();
	const url = await github.createAuthorizationURL(state);
	res.header(
		'set-cookie',
		serializeCookie('github_oauth_state', state, {
			path: '/',
			secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax',
		}),
	);
	res.send(url.toString());
});

type GitHubUserResponse =
	| {
			id: string;
			login: string;
	  }
	| undefined;

router.get<
	unknown,
	unknown,
	unknown,
	{
		code?: string;
		state?: string;
	}
>('/login/github/callback', async (req, res) => {
	const code = req.query.code?.toString() ?? null;
	const state = req.query.state?.toString() ?? null;
	const storedState = req.cookies.github_oauth_state ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		console.log(code, state, storedState);
		res.status(400).send();
		return;
	}
	console.log({ code, state, storedState });

	try {
		console.log('entering try blocks');
		const tokens = await github.validateAuthorizationCode(code);
		console.log({ tokens });
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});
		const githubUser = (await githubUserResponse.json()) as GitHubUserResponse;
		if (!githubUser?.id) {
			res.status(400).send();
			return;
		}

		console.log({ githubUser });

		const existingUser = await db.query.userTable.findFirst({
			where: eq(userTable.githubId, Number(githubUser.id)),
		});

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			console.log('existing user');
			return res
				.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize())
				.send();
		}

		const userId = generateIdFromEntropySize(10); // 16 characters long

		await db.insert(userTable).values({
			id: userId,
			githubId: Number(githubUser.id),
			username: githubUser.login,
		});

		const defaultPlaylists = [
			{ userId, name: 'Favorites', favorites: true },
			{ userId, name: 'Queue', queue: true },
		];
		await db.insert(playlists).values(defaultPlaylists);

		const session = await lucia.createSession(userId, {});
		console.log('created user');
		return res
			.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize())
			.send();
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			console.log(e);

			res.status(400).send();
			return;
		}
		console.log(e);
		console.log(code, state, storedState);
		res.status(500).send();
		return;
	}
});

router.post('/logout', async (req, res) => {
	const { session } = await validateRequest(req, res);
	if (!session) {
		res.status(401).send();
		return;
	}
	await lucia.invalidateSession(session.id);
	return res
		.header('Set-Cookie', lucia.createBlankSessionCookie().serialize())
		.status(200)
		.send();
});

export { router };
