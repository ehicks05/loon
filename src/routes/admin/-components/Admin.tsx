import type { ReactNode } from 'react';
import SystemSettings from './SystemSettings';
import { TrackInfo } from './TrackInfo';
import { Users } from './Users';

const Section = ({ title, children }: { title: string; children: ReactNode }) => {
	return (
		<section className="flex flex-wrap gap-4">
			<div className="flex flex-col gap-4 p-4 bg-black rounded">
				<div className="font-bold text-lg">{title}</div>
				{children}
			</div>
		</section>
	);
};

export function Admin() {
	return (
		<div className="flex flex-col gap-4">
			<section>
				<h1 className="font-bold text-2xl">System Settings</h1>
			</section>
			<div className="flex flex-wrap gap-4">
				<Section title="Settings">
					<SystemSettings />
				</Section>

				<Section title="Users">
					<Users />
				</Section>

				<Section title="Track Info">
					<TrackInfo />
				</Section>

				<Section title="debug">
					<TrackInfo />
				</Section>
			</div>
		</div>
	);
}
