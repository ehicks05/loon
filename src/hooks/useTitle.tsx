import { useDocumentTitle } from 'usehooks-ts';
import { useUser } from '@/hooks/useUser';
import { useLibrary } from './useLibrary';

export function useTitle() {
	const {
		user: { selectedTrackId },
	} = useUser();

	const { data } = useLibrary();
	const getTrackById = data?.getTrackById;
	const selectedTrack = getTrackById?.(selectedTrackId);

	const artist = selectedTrack?.artists.map((artist) => artist.name).join(', ');
	const title = selectedTrack ? `${selectedTrack.title} by ${artist}` : 'Loon';

	useDocumentTitle(title);
}
