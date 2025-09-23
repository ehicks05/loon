import { createFileRoute } from '@tanstack/react-router';
import { useLibraryStore } from '@/hooks/useLibraryStore';
import { getPlaylistById } from '@/hooks/usePlaylistStore';
import { PlaylistBuilder } from './-components/PlaylistBuilder';

export const Route = createFileRoute('/playlists/$id_/edit')({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const { tracks } = useLibraryStore();
	const playlist = getPlaylistById(id);

	return <PlaylistBuilder playlist={playlist} tracks={tracks} />;
}
