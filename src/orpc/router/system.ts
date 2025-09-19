import { ORPCError } from '@orpc/client';
import z from 'zod';
import { db } from '@/drizzle/db';
import { albums, artists, system_settings, tracks } from '@/drizzle/schema/main';
import { runLibrarySyncTask } from '@/server/services/library/sync';
import { listMediaFiles } from '@/server/utils/files';
import { base, isAdmin } from '../middleware';

const clearLibrary = base.use(isAdmin).handler(async () => {
	await db.delete(tracks);
	await db.delete(artists);
	await db.delete(albums);

	// todo: cascade rules

	return { success: true };
});

const get = base.use(isAdmin).handler(async () => {
	const system = await db.query.system_settings.findFirst();
	if (!system) throw new ORPCError('NOT_FOUND');
	return system;
});

const isSyncing = base.use(isAdmin).handler(async function* () {
	let previous = false;
	while (true) {
		const system = await db.query.system_settings.findFirst();
		if (!system) throw new ORPCError('NOT_FOUND');

		const payload = system.isSyncing;
		
		if (payload !== previous) {	
			yield payload;
		}
		previous = payload;
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
});

const listFiles = base.use(isAdmin).handler(async () => {
	const systemSettings = await db.query.system_settings.findFirst();
	if (!systemSettings) {
		return { mediaFiles: [] };
	}

	const mediaFiles = await listMediaFiles(systemSettings.musicFolder);

	return { mediaFiles };
});

const triggerSync = base.use(isAdmin).handler(() => {
	runLibrarySyncTask(); // don't await
	return;
});

const update = base
	.use(isAdmin)
	.input(
		z.object({
			musicFolder: z.string(),
			syncImages: z.boolean(),
		}),
	)
	.handler(async ({ input }) => {
		const systemSettings = (
			await db.update(system_settings).set(input).returning()
		)[0];
		return systemSettings;
	});

export const system = {
	clearLibrary,
	get,
	isSyncing,
	listFiles,
	triggerSync,
	update,
};
