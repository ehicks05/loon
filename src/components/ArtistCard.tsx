import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import { getArtistById } from '@/hooks/useLibraryStore';
import type { Artist } from '@/types/library';
import { ActionableImage } from './ActionableImage';
import { ArtistLinks } from './ArtistLinks';

interface Props {
	artist: Artist;
	size: 'full' | 'thumb';
}

export function ArtistCard({ artist: _artist, size }: Props) {
	const artist = getArtistById(_artist.id);
	if (!artist) return null;

	const image = size === 'full' ? artist.image : artist.imageThumb;
	const { albums, compilations, tracks } = artist;

	return (
		<div className="flex flex-col w-full items-start">
			<ActionableImage src={image} trackIds={tracks.map(({ id }) => id)} />
			<div className="flex flex-col p-2 w-full">
				<div className="text-xs text-center">
					<span className="text-green-500 font-bold">{tracks.length}</span> track
					{tracks.length !== 1 ? 's' : ''}
					{' · '}
					<span className="text-green-500 font-bold">
						{albums.length + compilations.length}
					</span>{' '}
					album{albums.length !== 1 ? 's' : ''}
				</div>
				<div className="text-lg text-center">
					<ArtistLinks artists={[artist]} />
				</div>
			</div>
		</div>
	);
}
