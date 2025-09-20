import { useState } from 'react';
import { Equalizer } from '@/components/Equalizer';

export default function GeneralSettings() {
	const [transcodeQuality, _] = useState('');

	return (
		<div className="flex flex-col gap-8">
			<section>
				<h1 className="text-2xl font-bold">Settings</h1>
				<h2 className="subtitle">General Settings</h2>

				<label className="flex gap-2 items-center">
					<input
						type="checkbox"
						name="transcode"
						checked={false}
						onChange={() => alert('not implemented')}
					/>
					Prefer transcoded mp3 v{transcodeQuality} (if available)
				</label>
			</section>

			<section className={'flex flex-col gap-4 items-start'}>
				<div>
					<h2 className="">Equalizer</h2>
				</div>

				<Equalizer />
			</section>
		</div>
	);
}
