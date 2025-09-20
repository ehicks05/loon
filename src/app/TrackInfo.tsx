import { useLibrary } from '@/hooks/useLibrary';
import { useUser } from '@/hooks/useUser';

export function TrackInfo() {
	const { selectedTrackId } = useUser();
	const { data } = useLibrary();
	const track = data?.getTrackById(selectedTrackId);

	return (
		<section className="flex flex-col gap-4">
			<div className="text-2xl font-bold">Selected Track Info</div>
			<div className="whitespace-pre-wrap font-mono text-sm">
				{JSON.stringify(track, null, 2)}
			</div>
		</section>
	);
}
