import { Equalizer } from '@/components/Equalizer';

export default function EqPage() {
	return (
		<section className={'flex flex-col gap-4 items-start'}>
			<div>
				<h1 className="font-bold text-2xl">Settings</h1>
				<h2 className="">Equalizer</h2>
			</div>

			<Equalizer />
		</section>
	);
}
