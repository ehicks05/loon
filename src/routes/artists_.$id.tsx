import { createFileRoute } from '@tanstack/react-router';
import { Artist } from '@/app/Artist';

export const Route = createFileRoute('/artists_/$id')({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	return <Artist id={id} />;
}
