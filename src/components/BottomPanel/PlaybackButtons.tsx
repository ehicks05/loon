import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { usePlayerStore } from '../../hooks/usePlayerStore';
import { useUser } from '../../hooks/useUser';
import { getNewTrackId } from '../Player/trackDeterminationUtils';
import { BUTTON_CLASS } from './BottomPanel';

export default function PlaybackButtons() {
	const playbackState = usePlayerStore((state) => state.playbackState);
	const setPlaybackState = usePlayerStore((state) => state.setPlaybackState);
	const { setSelectedTrackId } = useUser();

	function handleTrackChange(direction: 'prev' | 'next') {
		setSelectedTrackId(getNewTrackId(direction));
	}

	const PlaybackStateIcon = playbackState === 'playing' ? Pause : Play;

	return (
		<div className="flex gap-0.5 items-center">
			<button
				type="button"
				className={BUTTON_CLASS}
				onClick={() => handleTrackChange('prev')}
			>
				<SkipBack className="h-5 w-5 fill-current" />
			</button>
			<button
				type="button"
				className={BUTTON_CLASS}
				onClick={() =>
					setPlaybackState(playbackState === 'playing' ? 'paused' : 'playing')
				}
			>
				<PlaybackStateIcon className="h-7 w-7 fill-current" />
			</button>
			<button
				type="button"
				className={BUTTON_CLASS}
				onClick={() => handleTrackChange('next')}
			>
				<SkipForward className="h-5 w-5 fill-current" />
			</button>
		</div>
	);
}
