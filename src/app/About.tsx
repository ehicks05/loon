import { getTrackById } from '@/hooks/useLibraryStore';
import { useUserStore } from '@/hooks/useUser';

export default function About() {
	const selectedTrackId = useUserStore((state) => state.selectedTrackId);
	const track = getTrackById(selectedTrackId);

	return (
		<section className="flex flex-col gap-4">
			<div className="text-2xl font-bold">Selected Track Info</div>
			<div className="whitespace-pre-wrap font-mono text-sm">
				{JSON.stringify(track, null, 2)}
			</div>
		</section>
	);
}
