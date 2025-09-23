import { createFileRoute } from '@tanstack/react-router';
import { useLibraryStore } from '@/hooks/useLibraryStore';
import { PlaylistBuilder } from './-components/PlaylistBuilder';

export const Route = createFileRoute('/playlists/new')({
	component: RouteComponent,
});

function RouteComponent() {
	const { tracks } = useLibraryStore();

	return <PlaylistBuilder tracks={tracks} />;
}
