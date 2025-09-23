import { useDocumentTitle } from 'usehooks-ts';
import { useUserStore } from '@/hooks/useUserStore';
import { getTrackById } from './useLibraryStore';

export function useTitle() {
	const { selectedTrackId } = useUserStore();

	const selectedTrack = getTrackById(selectedTrackId);

	const artist = selectedTrack?.artists.map((artist) => artist.name).join(', ');
	const title = selectedTrack ? `${selectedTrack.title} by ${artist}` : 'Loon';

	useDocumentTitle(title);
}
