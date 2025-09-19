import { useQuery } from '@tanstack/react-query';
import { keyBy } from 'es-toolkit';
import { orpc } from '@/orpc/client';
import { denormalizeLibrary } from './denormalize';

export const useLibrary = () => {
	return useQuery({
		queryKey: ['library'],
		queryFn: async () => {
			const apiLibrary = await orpc.library.list.call();
			const library = denormalizeLibrary(apiLibrary);

			const trackById = keyBy(library.tracks, (o) => o.id);
			const albumById = keyBy(library.albums, (o) => o.id);
			const artistById = keyBy(library.artists, (o) => o.id);

			const getTrackById = (id: string) => trackById[id];
			const getAlbumById = (id: string) => albumById[id];
			const getArtistById = (id: string) => artistById[id];

			return {
				library,
				trackById,
				albumById,
				artistById,
				getTrackById,
				getAlbumById,
				getArtistById,
			};
		},
	});
};
