import { useLibrary } from '@/hooks/useLibrary';
import { usePlaylists } from '@/hooks/usePlaylists';
import { type PlaybackDirection, useUser } from '@/hooks/useUser';

/**
 * Get a random new index that cannot be the currentIndex
 */
const getShuffleIndex = (currentIndex: number, playlistLength: number) => {
	const roll = Math.floor(Math.random() * (playlistLength - 1)) + 1;
	return (currentIndex + roll) % playlistLength;
};

function getNewIndex(
	playbackDirection: number,
	currentTrackIndex: number,
	currentPlaylistTrackIds: string[],
	shuffle: boolean,
) {
	let newIndex = shuffle
		? getShuffleIndex(currentTrackIndex, currentPlaylistTrackIds.length)
		: currentTrackIndex + playbackDirection;

	if (newIndex === -1) {
		console.error('Unable to select a new track index.');
	}

	if (newIndex < 0) newIndex = currentPlaylistTrackIds.length - 1;
	if (newIndex >= currentPlaylistTrackIds.length) newIndex = 0;

	return newIndex;
}

function getCurrentPlaylistTrackIds(selectedPlaylistId: string) {
	const { data } = useLibrary();
	const { data: playlistData } = usePlaylists();
	const getPlaylistById = playlistData?.getPlaylistById;

	const tracks = data?.tracks || [];
	const currentPlaylist = getPlaylistById?.(selectedPlaylistId);
	if (currentPlaylist)
		return currentPlaylist.playlistTracks.map(
			(playlistTrack) => playlistTrack.trackId,
		);

	return tracks.map((track) => track.id);
}

export const getNewTrackId = ({
	direction,
	currentPlaylistTrackIds,
	currentTrackIndex,
	shuffle,
}: {
	direction: PlaybackDirection;
	currentPlaylistTrackIds: string[];
	currentTrackIndex: number;
	shuffle: boolean;
}) => {
	console.log({ currentPlaylistTrackIds });

	const newIndex = getNewIndex(
		direction === 'prev' ? -1 : 1,
		currentTrackIndex,
		currentPlaylistTrackIds,
		shuffle,
	);

	const newTrackId = currentPlaylistTrackIds[newIndex];
	if (!newTrackId) console.error('Unable to select a new track id.');

	return newTrackId;
};

export const useGetNewTrack = () => {
	const { selectedTrackId, selectedPlaylistId, shuffle } = useUser();

	const currentPlaylistTrackIds = getCurrentPlaylistTrackIds(selectedPlaylistId);
	const currentTrackIndex = currentPlaylistTrackIds.indexOf(selectedTrackId);

	return {
		getNewTrackId: (direction: PlaybackDirection) =>
			getNewTrackId({
				direction,
				currentPlaylistTrackIds,
				currentTrackIndex,
				shuffle,
			}),
	};
};
