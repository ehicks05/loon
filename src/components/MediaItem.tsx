import type { DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { Link } from '@tanstack/react-router';
import { setSelectedPlaylistId, useUserStore } from '../hooks/useUser';
import type { Track } from '../types/library';
import ActionMenu from './ActionMenu';
import { ArtistLinks } from './ArtistLinks';

interface Props {
	trackNumber: string | number;
	track: Track;
	playlistId: string;
	provided?: DraggableProvided;
	snapshot?: DraggableStateSnapshot;
}

export default function MediaItem({
	trackNumber,
	track,
	playlistId,
	provided,
}: Props) {
	const selectedTrackId = useUserStore((state) => state.selectedTrackId);

	const { missingFile } = track;
	const highlightClass = track.id === selectedTrackId ? 'text-green-500' : '';

	return (
		<div
			className={`group flex h-full p-2 rounded-lg hover:bg-neutral-800 transition-all ${highlightClass} ${missingFile ? 'bg-red-400' : ''}`}
			ref={provided?.innerRef}
			{...provided?.draggableProps}
		>
			<div className={'mr-1 min-w-8 text-right'}>{trackNumber}</div>

			<div {...provided?.dragHandleProps} className={'flex-grow'}>
				<button
					type="button"
					disabled={missingFile}
					className="line-clamp-1 font-bold text-left"
					onClick={() => setSelectedPlaylistId(playlistId, track.id)}
				>
					{track.title}
				</button>
				{missingFile && (
					<span className={'tag is-normal is-danger ml-4'}>Track Missing</span>
				)}
				<span className="line-clamp-1 text-sm text-neutral-400">
					<ArtistLinks artists={track.artists} linkClass="hover:text-neutral-300" />
					{' - '}
					<Link
						className="hover:text-neutral-300"
						to={'/albums/$id'}
						params={{ id: track.album.id }}
					>
						<i>{track.album.name}</i>
					</Link>
				</span>
			</div>

			<div className="invisible group-hover:visible mr-2 flex basis-5 items-center text-neutral-400 hover:text-neutral-300">
				<ActionMenu trackIds={[track.id]} />
			</div>

			<div className="basis-5">{track.formattedDuration}</div>
		</div>
	);
}
