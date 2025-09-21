import { useUser } from '../../hooks/useUser';
import { LoonSlider } from '../Slider';

const VolumeLabel = ({ volume }: { volume: number }) => (
	<div className="absolute right-0 bottom-6 opacity-0 group-hover:opacity-100 transition-all">
		<span className="text-right text-green-600 text-sm font-semibold">
			{volume}dB
		</span>
	</div>
);

export function VolumeSlider() {
	const { volume, setVolume } = useUser();

	return (
		<div className="w-32 max-w-32 md:w-auto md:flex-grow mr-1 relative group">
			<VolumeLabel volume={volume} />
			<LoonSlider
				value={[volume]}
				onValueChange={(value) => setVolume(value[0])}
				onDoubleClick={() => setVolume(0)}
				min={-30}
				max={0}
				step={1}
			/>
		</div>
	);
}
