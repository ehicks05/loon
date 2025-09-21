import { createFileRoute } from '@tanstack/react-router';
import { Playlists } from './-components/Playlists';

export const Route = createFileRoute('/playlists/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <Playlists />;
}
