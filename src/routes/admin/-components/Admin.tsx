import SystemSettings from './SystemSettings';
import { TrackInfo } from './TrackInfo';
import { Users } from './Users';

export function Admin() {
	return (
		<div className="flex flex-col gap-4">
			<section>
				<h1 className="font-bold text-2xl">System Settings</h1>
			</section>
			<div className="flex flex-wrap gap-4">
				<section className="flex flex-wrap gap-4">
					<div className="flex flex-col gap-4 p-4 bg-black rounded">
						<div className="font-bold text-lg">Settings</div>

						<SystemSettings />
					</div>
				</section>

				<section>
					<div className="flex flex-col gap-4 p-4 bg-black rounded">
						<div className="font-bold text-lg">Users</div>

						<Users />
					</div>
				</section>

				<section>
					<div className="flex flex-col gap-4 p-4 bg-black rounded">
						<div className="font-bold text-lg">Track Info</div>

						<TrackInfo />
					</div>
				</section>
			</div>
		</div>
	);
}
