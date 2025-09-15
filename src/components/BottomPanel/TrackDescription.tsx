import { Link } from 'react-router-dom';
import { useWindowSize } from 'usehooks-ts';
import { PLACEHOLDER_IMAGE_URL } from '@/constants';
import { getTrackById } from '../../hooks/useLibraryStore';
import { useUserStore } from '../../hooks/useUserStore';
import { ArtistLinks } from '../ArtistLinks';

export default function TrackDescription() {
	const { width } = useWindowSize();
	const textWidth = width >= 768 ? 'calc(100vw - 408px)' : '100%';

	const selectedTrackId = useUserStore((state) => state.selectedTrackId);
	const track = getTrackById(selectedTrackId);
	const imageUrl = track?.album?.imageThumb || PLACEHOLDER_IMAGE_URL;

	return (
		<div className="flex items-center justify-center md:justify-start gap-2">
			<img src={imageUrl} alt="album" className="h-20 rounded" />
			{track && (
				<span
					className="flex flex-col max-h-20 overflow-auto"
					style={{ maxWidth: textWidth }}
				>
					<b className="text-sm">{track.title}</b>
					<span className="flex flex-col text-sm">
						<ArtistLinks artists={track.artists} />
						<Link to={`/albums/${track.album.id}`}>
							<i>{track.album.name}</i>
						</Link>
					</span>
				</span>
			)}
		</div>
	);
}
