import { Link } from '@tanstack/react-router';
import { ActionableImage } from '@/components/ActionableImage';
import { ArtistCard } from '@/components/ArtistCard';
import MediaItem from '@/components/MediaItem';
import { useLibrary } from '@/hooks/useLibrary';
import type { Album } from '@/types/library';

const AlbumsWithTracks = ({ albums }: { albums: Album[] }) => {
	return (
		<div className="flex flex-col gap-8">
			{albums.map((album) => {
				const multiDisc = (album.tracks.at(-1)?.discNumber || 0) > 1;

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
									trackNumber={
										`${multiDisc ? `${track.discNumber}.` : ''}${track.trackNumber}` ||
										0
									}
								/>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export function Artist({ id }: { id: string }) {
	const { data } = useLibrary();
	const artist = data?.getArtistById(id);

	if (!artist) return null;

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
