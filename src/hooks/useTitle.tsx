import { useDocumentTitle } from 'usehooks-ts';
import { getTrackById } from '@/hooks/useLibraryStore';
import { useUser } from '@/hooks/useUser';

export function useTitle() {
	const {
		user: { selectedTrackId },
	} = useUser();
	const selectedTrack = getTrackById(selectedTrackId);
	const artist = selectedTrack?.artists.map((artist) => artist.name).join(', ');
	const title = selectedTrack ? `${selectedTrack.title} by ${artist}` : 'Loon';

	useDocumentTitle(title);
}
