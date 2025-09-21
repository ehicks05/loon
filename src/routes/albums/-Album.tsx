import MediaItem from '@/components/MediaItem';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import AlbumCard from '@/components/AlbumCard';
import type { Album as IAlbum, Track } from '@/types/library';

export const toTrackNumber = (album: IAlbum, track: Track) => {
	const multiDisc = (album.tracks.at(-1)?.discNumber || 0) > 1;
	return `${multiDisc ? `${track.discNumber}.` : ''}${track.trackNumber}` || 0;
};

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
