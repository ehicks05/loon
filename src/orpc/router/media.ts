import { openAsBlob } from 'node:fs';
import { ORPCError, os } from '@orpc/server';
import type { ResponseHeadersPluginContext } from '@orpc/server/plugins';
import { eq } from 'drizzle-orm';
import * as z from 'zod';
import { db } from '../../drizzle/db.js';
import { tracks } from '../../drizzle/schema/main.js';

const doesFileExist = async (path: string) => {
	console.log({ path });
	const blob = await openAsBlob(path);
	if (!blob) {
		return false;
	}
	return true;
};

interface ORPCContext extends ResponseHeadersPluginContext {}

const base = os.$context<ORPCContext>();

export const media = base
	.use(({ context, next }) => {
		context.resHeaders?.set('Accept-Ranges', 'true');
		context.resHeaders?.set('Content-Type', 'audio/mpeg');
		return next();
	})
	.input(z.object({ id: z.string() }))
	.handler(async ({ input: { id } }) => {
		if (!id) {
			throw new ORPCError('BAD_REQUEST');
		}

		const track = await db.query.tracks.findFirst({ where: eq(tracks.id, id) });
		const path = track?.path;
		if (!path) {
			throw new ORPCError('NOT_FOUND');
		}

		const fileExists = await doesFileExist(path);
		if (!fileExists) {
			throw new ORPCError('NOT_FOUND');
		}

		// const file = await fs.promises.readFile(path);
		const file = await openAsBlob(path);

		return { file };
	});
