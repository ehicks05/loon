import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { Artists } from './-Artists';

export const Route = createFileRoute('/artists/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { artists } = useLoaderData({ from: '__root__' });

	return <Artists artists={artists} />;
}
