import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { PlaylistBuilder } from './-components/PlaylistBuilder';

export const Route = createFileRoute('/playlists/$id_/edit')({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const {
		library: { tracks },
		playlists: { getPlaylistById },
	} = useLoaderData({ from: '__root__' });
	const playlist = getPlaylistById(id);

	return <PlaylistBuilder playlist={playlist} tracks={tracks} />;
}
