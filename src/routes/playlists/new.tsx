import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { PlaylistBuilder } from './-components/PlaylistBuilder';

export const Route = createFileRoute('/playlists/new')({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		library: { tracks },
	} = useLoaderData({ from: '__root__' });

	return <PlaylistBuilder tracks={tracks} />;
}
