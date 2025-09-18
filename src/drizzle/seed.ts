import { db } from './db';
import { playlists, system_settings, system_status } from './schema/main';

export const seed = async () => {
	console.log('seeding');
	const systemSettings = await db.query.system_settings.findFirst();
	if (!systemSettings) {
		console.log('..init system_settings');
		await db.insert(system_settings).values({});
	}

	const status = await db.query.system_status.findFirst();
	if (!status) {
		console.log('..init system_status');
		await db.insert(system_status).values({});
	} else {
		console.log('..setting system_status.isSyncing = false');
		await db.update(system_status).set({ isSyncing: false });
	}

	const users = await db.query.userTable.findMany();
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

	// await db.insert(albums).values({
	// 	id: '1',
	// 	name: 'bar',
	// });

	// await db.insert(tracks).values({
	// 	path: '',
	// 	duration: 0,
	// 	id: '1',
	// 	albumId: '1',
	// 	formattedDuration: '0:00',
	// 	title: 'foo',
	// 	trackGainLinear: '1',
	// 	trackPeak: '1',
	// });

	console.log('done');
};
