import * as Popover from '@radix-ui/react-popover';
import {
	Shuffle,
	SlidersVertical,
	Volume,
	Volume1,
	Volume2,
	VolumeOff,
} from 'lucide-react';
import { setMuted, setShuffle, useUserStore } from '@/hooks/useUserStore';
import { Equalizer } from './Equalizer';
import { PlaybackButtons } from './PlaybackButtons';
import { TrackDescription } from './TrackDescription';
import { TrackProgressBar } from './TrackProgressBar';
import { VolumeSlider } from './VolumeSlider';

export const BUTTON_CLASS = 'p-2 rounded hover:bg-neutral-800';

function ShuffleButton() {
	const { shuffle } = useUserStore();
	const className = `${BUTTON_CLASS} ${shuffle ? ' text-green-500' : ''}`;
	return (
		<button type="button" className={className} onClick={() => setShuffle(!shuffle)}>
			<Shuffle size={20} />
		</button>
	);
}

function MuteButton() {
	const { muted, volume } = useUserStore();
	const Icon = muted
		? VolumeOff
		: volume > -10
			? Volume2
			: volume > -20
				? Volume1
				: Volume;

	return (
		<button type="button" className={BUTTON_CLASS} onClick={() => setMuted(!muted)}>
			<Icon size={20} />
		</button>
	);
}

const EqPopover = () => {
	return (
		// keep inside a div to handle an extra div created by Popover
		<div>
			<Popover.Root modal>
				<Popover.Trigger className={BUTTON_CLASS}>
					<SlidersVertical size={20} />
				</Popover.Trigger>
				<Popover.Anchor />
				<Popover.Portal>
					<Popover.Content sideOffset={32}>
						<Popover.Close />
						<Popover.Arrow />
						<div className="p-2 rounded-lg shadow-2xl bg-neutral-950 text-white">
							<Equalizer />
						</div>
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>{' '}
		</div>
	);
};

export function BottomPanel() {
	return (
		<div className="flex justify-center w-full bg-neutral-900">
			<div className="flex flex-col items-center w-full max-w-screen-2xl justify-between md:flex-row gap-4 p-3">
				<div className="w-full md:w-1/2">
					<TrackDescription />
				</div>

				<div className="flex flex-col gap-4 md:gap-2 w-full items-center">
					<div className="w-full md:w-5/6">
						<TrackProgressBar />
					</div>
					<PlaybackButtons />
				</div>

				<div className="w-full md:w-1/2">
					<div className="flex gap-2 items-center justify-center md:justify-end md:ml-4">
						<ShuffleButton />
						<EqPopover />
						<MuteButton />
						<VolumeSlider />
					</div>
				</div>
			</div>
		</div>
	);
}
