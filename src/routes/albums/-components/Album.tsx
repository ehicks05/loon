import MediaItem from '@/components/MediaItem';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import { toTrackNumber } from '@/lib/utils';
import AlbumCard from '@/routes/albums/-components/AlbumCard';
import type { Album as IAlbum } from '@/types/library';

export function Album({ album }: { album: IAlbum }) {
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
						trackNumber={toTrackNumber(album, track)}
					/>
				))}
			</ul>
		</section>
	);
}
