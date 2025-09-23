import { createFileRoute, notFound } from '@tanstack/react-router';
import { getAlbumById } from '@/hooks/useLibraryStore';
import { Album } from './-components/Album';

export const Route = createFileRoute('/albums/$id')({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const album = getAlbumById(id);

	if (!album) {
		throw notFound();
	}

	return <Album album={album} />;
}
