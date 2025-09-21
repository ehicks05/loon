import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { Artist } from './-Artist';

export const Route = createFileRoute('/artists/$id')({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const {
		library: { getArtistById },
	} = useLoaderData({ from: '__root__' });
	const artist = getArtistById(id);

	return <Artist artist={artist} />;
}
