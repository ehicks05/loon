import { getTrackById } from '@/hooks/useLibraryStore';
import { useUserStore } from '@/hooks/useUserStore';

export function TrackInfo() {
	const { selectedTrackId } = useUserStore();
	const track = getTrackById(selectedTrackId);

	return (
		<section className="flex flex-col gap-4">
			<div className="whitespace-pre-wrap font-mono text-sm">
				{JSON.stringify(track, null, 2)}
			</div>
		</section>
	);
}
