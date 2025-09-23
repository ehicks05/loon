import { createFileRoute, notFound } from '@tanstack/react-router';
import { getArtistById } from '@/hooks/useLibraryStore';
import { Artist } from './-components/Artist';

export const Route = createFileRoute('/artists/$id')({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	const artist = getArtistById(id);

	if (!artist) {
		throw notFound();
	}

	return <Artist artist={artist} />;
}
