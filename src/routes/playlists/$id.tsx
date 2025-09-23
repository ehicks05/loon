import { createFileRoute } from '@tanstack/react-router';
import { getPlaylistById } from '@/hooks/usePlaylistStore';
import { Playlist } from './-components/Playlist';

export const Route = createFileRoute('/playlists/$id')({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const playlist = getPlaylistById(id);

	if (!playlist) return <div>loading</div>;

	return <Playlist playlist={playlist} />;
}
