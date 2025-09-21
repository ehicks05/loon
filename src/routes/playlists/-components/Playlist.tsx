import {
	DragDropContext,
	Draggable,
	Droppable,
	type DropResult,
} from '@hello-pangea/dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { type CSSProperties, useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useResizeObserver } from 'usehooks-ts';
import MediaItem from '@/components/MediaItem';
import { MediaItemDrag } from '@/components/MediaItemDrag';
import { usePlaylistStore } from '@/hooks/usePlaylistStore';
import { useUser } from '@/hooks/useUser';
import { orpc } from '@/orpc/client';
import type { Playlist as IPlaylist } from '@/orpc/types';
import type { Track } from '@/types/library';
import { usePlaylists } from '@/hooks/usePlaylists';

interface RowProps {
	data: {
		tracks: Track[];
		playlistId: string;
	};
	index: number;
	style: CSSProperties;
}

const Row = ({ data: { tracks, playlistId }, index, style }: RowProps) => {
	const track = tracks[index];

	return (
		<Draggable draggableId={track.id} index={index}>
			{(provided, snapshot) => (
				<div style={style}>
					<MediaItem
						provided={provided}
						snapshot={snapshot}
						playlistId={playlistId}
						track={track}
						trackNumber={index + 1}
					/>
				</div>
			)}
		</Draggable>
	);
};

interface Props {
	playlist: IPlaylist;
	trackById: Record<string, Track>;
}

export function Playlist({ playlist, trackById }: Props) {
	const playlistId = playlist.id;

	// const { handleDragAndDrop } = usePlaylists();

	const { selectedTrackId } = useUser();
	const selectedTrackIndex = playlist.playlistTracks.findIndex(
		(t) => t.trackId === selectedTrackId,
	);

	const queryClient = useQueryClient();

	const { mutate: persistDragAndDrop } = useMutation({
		...orpc.playlist.dragAndDrop.mutationOptions(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orpc.playlist.list.queryKey() });
		},
	});

	const listRef = useRef<List>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const { height: containerHeight = 0 } = useResizeObserver<HTMLDivElement | null>({
		ref: containerRef,
	});

	function onDragEnd({ source, destination }: DropResult) {
		// dropped outside the list
		if (!destination) return;
		// didn't move
		if (source.index === destination.index) return;

		if (!playlistId) return;

		const args = {
			playlistId,
			oldIndex: source.index,
			newIndex: destination.index,
		};

		// handleDragAndDrop(args);
		persistDragAndDrop(args);
	}

	useEffect(() => {
		if (selectedTrackIndex) {
			listRef.current?.scrollToItem(selectedTrackIndex, 'smart');
		}
	}, [selectedTrackIndex]);

	if (!playlist) return <div>Loading...</div>;

	const mediaList = (
		<div ref={containerRef} className="h-full overflow-hidden">
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable
					droppableId="droppable"
					mode="virtual"
					renderClone={(provided, _snapshot, { source: { index } }) => {
						const trackId = playlist.playlistTracks[index]?.trackId;
						const track = trackId && trackById[trackId];
						if (!track) return null;
						return (
							<MediaItemDrag
								key={track.id}
								provided={provided}
								track={track}
								trackNumber={index + 1}
							/>
						);
					}}
				>
					{(provided, _snapshot) => (
						<div ref={provided.innerRef} className="flex h-full flex-grow flex-col">
							<List
								ref={listRef}
								width="100%"
								height={containerHeight}
								itemData={{
									tracks: playlist.playlistTracks.map((pt) => trackById[pt.trackId]),
									playlistId,
								}}
								overscanCount={3}
								outerRef={provided.innerRef}
								itemCount={playlist.playlistTracks.length}
								itemKey={(index, data) => data.tracks[index].id}
								itemSize={60}
								initialScrollOffset={(selectedTrackIndex || 0) * 60}
							>
								{Row}
							</List>
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	);

	return (
		<div className="flex h-full flex-col gap-4">
			<section className={'flex flex-col gap-2'}>
				<h1 className="font-bold text-2xl">{playlist.name}</h1>
				<div className="flex gap-4">
					<Link
						to="/playlists/$id/edit"
						params={{ id: playlist.id }}
						className="p-2 bg-black rounded"
					>
						Edit
					</Link>
				</div>
			</section>

			{mediaList}
		</div>
	);
}
