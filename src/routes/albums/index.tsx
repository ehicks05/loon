import { createFileRoute } from '@tanstack/react-router';
import { useLibraryStore } from '@/hooks/useLibraryStore';
import { Albums } from './-components/Albums';

export const Route = createFileRoute('/albums/')({
	component: RouteComponent,
});

function RouteComponent() {
	const albums = useLibraryStore((state) => state.albums);

	return <Albums albums={albums} />;
}
