import { useQuery } from '@tanstack/react-query';
import { keyBy } from 'es-toolkit';
import { orpc } from '@/orpc/client';
import type { Playlist } from '@/orpc/types';

interface HandleDragAndDropParams {
	playlists: Playlist[];
	playlistId: string;
	oldIndex: number;
	newIndex: number;
}

const handleDragAndDrop = ({
	playlists,
	playlistId,
	oldIndex,
	newIndex,
}: HandleDragAndDropParams) => {
	const playlist = playlists.find((p) => p.id === playlistId);
	const rest = playlists.filter((p) => p.id !== playlistId);

	if (!playlist) {
		return;
	}

	// splice the moving track from oldIndex to newIndex,
	// then do a brute force reindexing
	const tracks = [...playlist.playlistTracks];
	const track = tracks[oldIndex];
	tracks.splice(oldIndex, 1);
	tracks.splice(newIndex, 0, track);
	tracks.forEach((track, i) => {
		track.index = i;
	});

	playlist.playlistTracks = tracks;
	// usePlaylistStore.setState((state) => ({
	// 	...state,
	// 	playlists: [...rest, playlist],
	// }));
};

export const fetchPlaylists = async () => {
	const playlists = await orpc.playlist.list.call();
	const playlistById = keyBy(playlists, (o) => o.id);
	const getPlaylistById = (id: string) => playlistById[id];

	return {
		playlists,
		playlistById,
		getPlaylistById,

		handleDragAndDrop,
	};
};

export const usePlaylists = () => {
	return useQuery({
		queryKey: ['playlists'],
		queryFn: async () => {
			return fetchPlaylists();
		},
	});
};
