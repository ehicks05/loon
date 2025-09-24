import { createFileRoute } from '@tanstack/react-router';
import { useLibraryStore } from '@/hooks/useLibraryStore';
import { Artists } from './-components/Artists';

export const Route = createFileRoute('/artists/')({
	component: RouteComponent,
});

function RouteComponent() {
	const artists = useLibraryStore((state) => state.artists);

	return <Artists artists={artists} />;
}
