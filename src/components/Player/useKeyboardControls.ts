import { useRef } from 'react';
import { useEventListener } from 'usehooks-ts';
import type { PlaybackState } from '@/hooks/usePlayerStore';
import type { PlaybackDirection } from '@/hooks/useUser';

export const useKeyboardControls = (
	playbackState: PlaybackState,
	setPlaybackState: (state: PlaybackState) => void,
	changeTrack: (direction: PlaybackDirection) => void,
) => {
	const documentRef = useRef<Document>(document);

	useEventListener(
		'keydown',
		(e: KeyboardEvent) => {
			const target = e.target as HTMLInputElement | null;
			if (target?.tagName === 'INPUT') return;

			if (e.key === ' ')
				setPlaybackState(playbackState === 'playing' ? 'paused' : 'playing');
			if (e.key === 'ArrowRight') changeTrack('next');
			if (e.key === 'ArrowLeft') changeTrack('prev');
		},
		documentRef,
	);
};
