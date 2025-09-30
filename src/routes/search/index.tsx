import { createFileRoute } from '@tanstack/react-router';
import { useLibraryStore } from '@/hooks/useLibraryStore';
import { Search } from './-components/Search';

export const Route = createFileRoute('/search/')({
	component: RouteComponent,
});

function RouteComponent() {
	const tracks = useLibraryStore((state) => state.tracks);

	return <Search tracks={tracks} />;
}
