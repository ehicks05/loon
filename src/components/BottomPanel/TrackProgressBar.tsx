import { useEffect, useState } from 'react';
import { usePlayerStore } from '../../hooks/usePlayerStore';
import { LoonSlider } from '../Slider';

const formatTime = (_input: number) => {
	const secs = Math.round(_input);
	const minutes = Math.floor(secs / 60) || 0;
	const seconds = Math.round(secs - minutes * 60) || 0;
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export function TrackProgressBar() {
	const elapsedTime = usePlayerStore((state) => state.elapsedTime);
	const duration = usePlayerStore((state) => state.duration);
	const setForcedElapsedTime = usePlayerStore((state) => state.setForcedElapsedTime);

	const [localValue, setLocalValue] = useState(elapsedTime);
	const [isPointerDown, setIsPointerDown] = useState(false);

	useEffect(() => {
		if (!isPointerDown) {
			setLocalValue(elapsedTime);
		}
	}, [isPointerDown, elapsedTime]);

	const formattedElapsedTime = formatTime(localValue);
	const formattedDuration = formatTime(duration);

	return (
		<div className="flex gap-3 items-center">
			<span className="text-sm">{formattedElapsedTime}</span>
			<LoonSlider
				value={[localValue]}
				onPointerDown={() => setIsPointerDown(true)}
				onPointerUp={() => setIsPointerDown(false)}
				onValueChange={(value) => setLocalValue(value[0])}
				onValueCommit={() => setForcedElapsedTime(localValue)}
				min={0}
				max={duration}
				step={1}
			/>
			<span className="text-sm">{formattedDuration}</span>
		</div>
	);
}
