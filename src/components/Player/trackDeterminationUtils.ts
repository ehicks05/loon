import { useLibraryStore } from '@/hooks/useLibraryStore';
import { getPlaylistById } from '@/hooks/usePlaylistStore';
import { type PlaybackDirection, useUser } from '@/hooks/useUser';

export const getNewTrackId = (input: PlaybackDirection) => {
	const { selectedTrackId, selectedPlaylistId, shuffle } = useUser();

	const currentPlaylistTrackIds = getCurrentPlaylistTrackIds(selectedPlaylistId);
	const currentTrackIndex = currentPlaylistTrackIds.indexOf(selectedTrackId);

	const newIndex = getNewIndex(
		input,
		currentTrackIndex,
		currentPlaylistTrackIds,
		shuffle,
	);

	const newTrackId = currentPlaylistTrackIds[newIndex];
	if (!newTrackId) console.error('Unable to select a new track id.');

	return newTrackId;
};

function getCurrentPlaylistTrackIds(selectedPlaylistId: string) {
	const tracks = useLibraryStore.getState().tracks;
	const currentPlaylist = getPlaylistById(selectedPlaylistId);
	if (currentPlaylist)
		return currentPlaylist.playlistTracks.map(
			(playlistTrack) => playlistTrack.trackId,
		);

	return tracks.map((track) => track.id);
}

/**
 * Get a random new index that cannot be the currentIndex
 */
const getShuffleIndex = (currentIndex: number, playlistLength: number) => {
	const roll = Math.floor(Math.random() * (playlistLength - 1)) + 1;
	return (currentIndex + roll) % playlistLength;
};

function getNewIndex(
	input: PlaybackDirection,
	currentTrackIndex: number,
	currentPlaylistTrackIds: string[],
	shuffle: boolean,
) {
	let newIndex = shuffle
		? getShuffleIndex(currentTrackIndex, currentPlaylistTrackIds.length)
		: input === 'prev'
			? currentTrackIndex - 1
			: input === 'next'
				? currentTrackIndex + 1
				: -1;

	if (newIndex === -1) {
		console.error('Unable to select a new track index.');
	}

	if (newIndex < 0) newIndex = currentPlaylistTrackIds.length - 1;
	if (newIndex >= currentPlaylistTrackIds.length) newIndex = 0;

	return newIndex;
}
