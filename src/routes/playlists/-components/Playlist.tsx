import {
	DragDropContext,
	Draggable,
	Droppable,
	type DropResult,
} from '@hello-pangea/dnd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { useEffect } from 'react';
import { List, type RowComponentProps, useListRef } from 'react-window';
import MediaItem from '@/components/MediaItem';
import { MediaItemDrag } from '@/components/MediaItemDrag';
import { getTrackById } from '@/hooks/useLibraryStore';
import { usePlaylistStore } from '@/hooks/usePlaylistStore';
import { useUserStore } from '@/hooks/useUserStore';
import { orpc } from '@/orpc/client';
import type { Playlist as IPlaylist } from '@/orpc/types';
import type { Track } from '@/types/library';

type RowProps = RowComponentProps<{
	tracks: Track[];
	playlistId: string;
}>;

const Row = ({ tracks, playlistId, index, style }: RowProps) => {
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
}

export function Playlist({ playlist }: Props) {
	const playlistId = playlist.id;

	const handleDragAndDrop = usePlaylistStore((state) => state.handleDragAndDrop);

	const selectedTrackId = useUserStore((state) => state.selectedTrackId);
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

	const listRef = useListRef(null);

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

		handleDragAndDrop(args);
		persistDragAndDrop(args);
	}

	useEffect(() => {
		if (selectedTrackIndex !== -1) {
			listRef.current?.scrollToRow({ index: selectedTrackIndex });
		}
	}, [selectedTrackIndex, listRef.current?.scrollToRow]);

	if (!playlist) return <div>Loading...</div>;

	const tracks = playlist.playlistTracks
		.map((playlistTrack) => getTrackById(playlistTrack.trackId))
		.filter((t) => !!t);

	const mediaList = (
		<div className="h-full overflow-hidden">
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable
					droppableId="droppable"
					mode="virtual"
					renderClone={(provided, _snapshot, { source: { index } }) => {
						const trackId = playlist.playlistTracks[index]?.trackId;
						const track = trackId && getTrackById(trackId);
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
								listRef={listRef}
								rowComponent={Row}
								rowCount={playlist.playlistTracks.length}
								rowHeight={60}
								rowProps={{ tracks, playlistId }}
							/>
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
