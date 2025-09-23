import { Link } from '@tanstack/react-router';
import { ActionableImage } from '@/components/ActionableImage';
import { ArtistLinks } from '@/components/ArtistLinks';
import type { Album } from '@/types/library';

const CUSTOM_SIZES = [
	{ length: 8, size: 'text-xl' },
	{ length: 16, size: 'text-lg' },
	{ length: 24, size: 'text-base' },
	{ length: 32, size: 'text-sm' },
] as const;

interface Props {
	album: Album;
	hideAlbumArtist?: boolean;
}

export default function AlbumCard({ album, hideAlbumArtist }: Props) {
	const albumNameSize =
		CUSTOM_SIZES.find((customSize) => album.name.length <= customSize.length)
			?.size || 'text-xs';

	return (
		<div className="flex flex-col items-start">
			<ActionableImage src={album.image} trackIds={album.tracks.map((o) => o.id)} />
			<div className="flex flex-col p-3 text-center w-full">
				{!hideAlbumArtist && (
					<span className="text-sm">
						<ArtistLinks artists={album.albumArtists} />
					</span>
				)}

				<Link to={'/albums/$id'} params={{ id: album.id }}>
					<span className={albumNameSize}>{album.name}</span>
				</Link>
			</div>
		</div>
	);
}
