import { LoonSlider } from '@/components/Slider';
import {
	type EqBand as IEqBand,
	setEqBands,
	useUserStore,
} from '@/hooks/useUserStore';

const FILTER_TYPE_LABELS: Partial<Record<BiquadFilterType, string>> = {
	lowshelf: 'Low Shelf',
	peaking: 'Peaking',
	highshelf: 'High Shelf',
};

const EqBand = ({ eq }: { eq: IEqBand }) => {
	const eqBands = useUserStore((state) => state.eqBands);

	const handleUpdate = (newBand: IEqBand, id: number) =>
		setEqBands(eqBands.map((band) => (band.id === id ? newBand : band)));

	return (
		<div className="flex flex-col gap-2">
			<div className="text-center text-xs p-1">{FILTER_TYPE_LABELS[eq.type]}</div>
			<div className="flex flex-col items-center h-56">
				<LoonSlider
					value={[eq.gain]}
					onValueChange={(value) => handleUpdate({ ...eq, gain: value[0] }, eq.id)}
					onDoubleClick={() => handleUpdate({ ...eq, gain: 0 }, eq.id)}
					min={-12}
					max={12}
					step={1}
					orientation="vertical"
				/>
				<span>
					{eq.gain > 0 ? '+' : ''}
					{eq.gain} dB
				</span>
			</div>

			<div className="flex gap-1 items-baseline pr-2 bg-neutral-800">
				<input
					className="bg-neutral-800 w-12 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					type="number"
					min={20}
					max={20000}
					step={1}
					value={eq.frequency}
					onChange={(e) => {
						const frequency = Number(e.target.value);
						handleUpdate({ ...eq, frequency }, eq.id);
					}}
				/>
				<span className="text-xs">hz</span>
			</div>
		</div>
	);
};

export const Equalizer = () => {
	const eqBands = useUserStore((state) => state.eqBands);

	return (
		<div className="flex gap-2">
			{eqBands.map((eq) => (
				<EqBand key={eq.id} eq={eq} />
			))}
		</div>
	);
};
