import { useQuery } from '@tanstack/react-query';
import { keyBy } from 'es-toolkit';
import { orpc } from '@/orpc/client';
import { denormalizeLibrary } from './denormalize';

export const fetchAndDenormalizeLibrary = async () => {
	const apiLibrary = await orpc.library.list.call();
	const library = denormalizeLibrary(apiLibrary);

	const { tracks, albums, artists } = library;

	const trackById = keyBy(tracks, (o) => o.id);
	const albumById = keyBy(albums, (o) => o.id);
	const artistById = keyBy(artists, (o) => o.id);

	const getTrackById = (id: string) => trackById[id];
	const getAlbumById = (id: string) => albumById[id];
	const getArtistById = (id: string) => artistById[id];

	return {
		tracks,
		albums,
		artists,

		trackById,
		albumById,
		artistById,

		getTrackById,
		getAlbumById,
		getArtistById,
	};
};

export const useLibrary = () => {
	return useQuery({
		queryKey: ['library'],
		queryFn: async () => {
			return fetchAndDenormalizeLibrary();
		},
	});
};
