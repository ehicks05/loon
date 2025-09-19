import { db } from './db';
import { playlists, system_settings } from './schema/main';

const ensureExistsSystemSettings = async () => {
	const systemSettings = await db.query.system_settings.findFirst();
	if (!systemSettings) {
		console.log('..init system_settings');
		await db.insert(system_settings).values({});
	}
};

const ensureSystemSyncIsFalse = async () => {
	await db.update(system_settings).set({ isSyncing: false });
};

const ensureExistsUserDefaultPlaylists = async () => {
	const users = await db.query.user.findMany();
	const allPlaylists = await db.query.playlists.findMany();

	const newPlaylists = users.flatMap((user) => {
		const userPlaylists = allPlaylists.filter((p) => p.userId === user.id);

		const favorites = userPlaylists.some((p) => p.favorites)
			? []
			: [{ userId: user.id, name: 'Favorites', favorites: true }];
		const queue = userPlaylists.some((p) => p.queue)
			? []
			: [{ userId: user.id, name: 'Queue', queue: true }];

		return [...favorites, ...queue];
	});

	if (newPlaylists.length) {
		console.log('..ensuring all users have playlists for favorites and queue');
		await db.insert(playlists).values(newPlaylists);
	}
};

export const seed = async () => {
	console.log('seeding');

	await ensureExistsSystemSettings();
	await ensureSystemSyncIsFalse();
	await ensureExistsUserDefaultPlaylists();

	console.log('done');
};
