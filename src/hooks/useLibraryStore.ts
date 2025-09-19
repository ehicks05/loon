import { keyBy } from 'es-toolkit';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Album, Artist, Track } from '../types/library';

export const useLibraryStore = create<{
	tracks: Track[];
	albums: Album[];
	artists: Artist[];
}>(
	devtools(
		() => ({
			tracks: [] as Track[],
			albums: [] as Album[],
			artists: [] as Artist[],
		}),
		{ name: 'library' },
	),
);

export const useTrackMap = () => {
	return useLibraryStore((state) => keyBy(state.tracks, (track) => track.id));
};

export const getTrackById = (id: string) =>
	useLibraryStore.getState().tracks.find((track) => track.id === id);
