import create from 'zustand';
import type { Playlist } from '../types/trpc';

export const usePlaylistStore = create<{
	playlists: Playlist[];
	handleDragAndDrop: ({
		playlistId,
		oldIndex,
		newIndex,
	}: {
		playlistId: string;
		oldIndex: number;
		newIndex: number;
	}) => void;
}>(() => ({
	playlists: [] as Playlist[],
	handleDragAndDrop: ({
		playlistId,
		oldIndex,
		newIndex,
	}: {
		playlistId: string;
		oldIndex: number;
		newIndex: number;
	}) => {
		const playlists = usePlaylistStore.getState().playlists;
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
		usePlaylistStore.setState((state) => ({
			...state,
			playlists: [...rest, playlist],
		}));
	},
}));

export const getPlaylistById = (id: string) => {
	return usePlaylistStore.getState().playlists.find((p) => p.id === id);
};
