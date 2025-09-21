import { Link } from '@tanstack/react-router';
import { ActionableImage } from '@/components/ActionableImage';
import MediaItem from '@/components/MediaItem';
import { toTrackNumber } from '@/lib/utils';
import { ArtistCard } from '@/routes/artists/-components/ArtistCard';
import type { Album, Artist as IArtist } from '@/types/library';

const AlbumsWithTracks = ({ albums }: { albums: Album[] }) => {
	return (
		<div className="flex flex-col gap-8">
			{albums.map((album) => {
				return (
					<div key={album.id} className="flex flex-col gap-4">
						<div className="max-w-40 flex items-center gap-4">
							<ActionableImage
								src={album.imageThumb}
								trackIds={album.tracks.map(({ id }) => id)}
							/>
							<Link
								to={'/albums/$id'}
								params={{ id: album.id }}
								className="text-xl flex-shrink-0"
							>
								{album.name}
							</Link>
						</div>

						<div>
							{album.tracks.map((track) => (
								<MediaItem
									key={track.id}
									playlistId={''}
									track={track}
									trackNumber={toTrackNumber(album, track)}
								/>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export function Artist({ artist }: { artist: IArtist }) {
	return (
		<section className="">
			<div className="flex flex-col gap-4">
				<div className="max-w-96">
					<ArtistCard artist={artist} size="full" />
				</div>
				<div className="flex flex-col gap-4">
					<div className="text-lg font-bold">Albums</div>
					<AlbumsWithTracks albums={artist.albums} />
				</div>

				<div className="flex flex-col gap-4">
					<div className="text-lg font-bold">Compilations</div>
					<AlbumsWithTracks albums={artist.compilations} />
				</div>
			</div>
		</section>
	);
}
