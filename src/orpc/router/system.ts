import z from 'zod';
import { db } from '@/drizzle/db';
import { albums, artists, system_settings, tracks } from '@/drizzle/schema/main';
import { runLibrarySyncTask } from '@/server/services/library/sync';
import { listMediaFiles } from '@/server/utils/files';
import { base } from '../context';
import { isAdmin } from '../middleware';

const clearLibrary = base.use(isAdmin).handler(async () => {
	await db.delete(tracks);
	await db.delete(artists);
	await db.delete(albums);

	// todo: cascade rules

	return { success: true };
});

const get = base.use(isAdmin).handler(() => {
	return db.query.system_settings.findFirst();
});

const listFiles = base.use(isAdmin).handler(async () => {
	const systemSettings = await db.query.system_settings.findFirst();
	if (!systemSettings) {
		return { mediaFiles: [] };
	}

	const mediaFiles = await listMediaFiles(systemSettings.musicFolder);

	return { mediaFiles };
});

const syncStatus = base.use(isAdmin).handler(() => {
	return db.query.system_status.findFirst();
});

const triggerSync = base.use(isAdmin).handler(() => {
	// don't await
	runLibrarySyncTask();
	return;
});

const update = base
	.use(isAdmin)
	.input(
		z.object({
			musicFolder: z.string(),
			syncDb: z.boolean(),
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
	listFiles,
	syncStatus,
	triggerSync,
	update,
};
