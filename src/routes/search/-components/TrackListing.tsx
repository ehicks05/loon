import { useEffect } from 'react';
import { List, type RowComponentProps, useListRef } from 'react-window';
import MediaItem from '@/components/MediaItem';
import { useUser } from '@/hooks/useUser';
import type { Track } from '@/types/library';

type RowProps = RowComponentProps<{ tracks: Track[] }>;

const Row = ({ tracks, index, style }: RowProps) => (
	<div style={style}>
		<MediaItem playlistId={''} track={tracks[index]} trackNumber={index + 1} />
	</div>
);

interface Props {
	tracks: Track[];
}

export const TrackListing = ({ tracks }: Props) => {
	const listRef = useListRef(null);

	const { selectedTrackId } = useUser();
	const selectedTrackIndex = tracks.findIndex((t) => t.id === selectedTrackId);

	useEffect(() => {
		if (tracks.length && selectedTrackIndex !== -1) {
			listRef.current?.scrollToRow({ index: selectedTrackIndex, align: 'auto' });
		}
	}, [tracks.length, selectedTrackIndex, listRef.current?.scrollToRow]);

	return (
		<div className="flex h-full flex-grow flex-col">
			<List
				listRef={listRef}
				rowComponent={Row}
				rowCount={tracks.length}
				rowHeight={60}
				rowProps={{ tracks }}
			/>
		</div>
	);
};
