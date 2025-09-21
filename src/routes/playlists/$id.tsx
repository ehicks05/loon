import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { usePlaylists } from '@/hooks/usePlaylists';
import { Playlist } from './-components/Playlist';

export const Route = createFileRoute('/playlists/$id')({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const {
		library: { trackById },
		playlists: { getPlaylistById },
	} = useLoaderData({ from: '__root__' });
	// const playlist = getPlaylistById(id);

	const { data } = usePlaylists();
	const playlist = data?.playlistById[id];

	if (!playlist) return <div>loading</div>;

	return <Playlist playlist={playlist} trackById={trackById} />;
}
