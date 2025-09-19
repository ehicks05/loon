import { os } from '@orpc/server';
import { eq } from 'drizzle-orm';
import { uint8ArrayToBase64 } from 'uint8array-extras';
import z from 'zod';
import { db } from '@/drizzle/db';
import { fetchLibrary } from '@/drizzle/fetchLibrary';
import { tracks } from '@/drizzle/schema/main';
import { getPictures } from '@/server/services/library/metadata';

export const list = os.handler(() => {
	return fetchLibrary();
});

export const pictures = os
	.input(z.object({ id: z.string() }))
	.handler(async ({ input: { id } }) => {
		const track = await db.query.tracks.findFirst({
			where: eq(tracks.id, id),
		});

		if (!track || !track.path) {
			return [];
		}
		const pictures = await getPictures(track?.path);

		return pictures?.map((picture) => ({
			...picture,
			data: undefined,
			imgSrc: `data:${picture.format};base64,${uint8ArrayToBase64(picture.data)}`,
		}));
	});

export const library = { list, pictures };
