import { keyBy } from 'es-toolkit';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Album, Artist, Track } from '../types/library';

interface LibraryStore {
	tracks: Track[];
	albums: Album[];
	artists: Artist[];
}

export const useLibraryStore = create<LibraryStore>()(
	devtools(
		() => ({
			tracks: [] as Track[],
			albums: [] as Album[],
			artists: [] as Artist[],
		}),
		{ name: 'library' },
	),
);

export const trackById = () => {
	return useLibraryStore((state) => keyBy(state.tracks, (t) => t.id));
};

export const getTrackById = (id: string) =>
	useLibraryStore.getState().tracks.find((track) => track.id === id);

export const getAlbumById = (id?: string) =>
	useLibraryStore.getState().albums.find((track) => track.id === id);

export const getArtistById = (id?: string) =>
	useLibraryStore.getState().artists.find((track) => track.id === id);
