import MediaItem from '@/components/MediaItem';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import { useParams } from 'react-router-dom';
import AlbumCard from '@/components/AlbumCard';
import { getAlbumById } from '@/hooks/useLibraryStore';

export default function Album() {
	const { id } = useParams();

	const album = getAlbumById(id || '');
	if (!album) return null;
	const multiDisc = (album.tracks.at(-1)?.discNumber || 0) > 1;

	return (
		<section>
			<div className="max-w-96">
				<AlbumCard album={album} />
			</div>
			<ul className="flex flex-col">
				{album.tracks.map((track) => (
					<MediaItem
						key={track.id}
						playlistId=""
						track={track}
						trackNumber={
							`${multiDisc ? `${track.discNumber}.` : ''}${track.trackNumber}` || 0
						}
					/>
				))}
			</ul>
		</section>
	);
}
