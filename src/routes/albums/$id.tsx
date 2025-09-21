import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { Album } from './-components/Album';

export const Route = createFileRoute('/albums/$id')({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const {
		library: { getAlbumById },
	} = useLoaderData({ from: '__root__' });
	const album = getAlbumById(id);

	return <Album album={album} />;
}
