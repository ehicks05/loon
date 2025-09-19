import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/orpc/client';
import { denormalizeLibrary } from './denormalize';

export const useLibrary = () => {
	return useQuery({
		queryKey: ['library'],
		queryFn: async () => {
			const library = await orpc.library.list.call();
			const denormalized = denormalizeLibrary(library);
			return denormalized;
		},
	});
};
