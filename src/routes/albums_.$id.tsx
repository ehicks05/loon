import { createFileRoute } from '@tanstack/react-router';
import { Album } from '@/app/Album';

export const Route = createFileRoute('/albums_/$id')({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	return <Album id={id} />;
}
