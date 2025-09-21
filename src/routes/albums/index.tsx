import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { Albums } from './-components/Albums';

export const Route = createFileRoute('/albums/')({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		library: { albums },
	} = useLoaderData({ from: '__root__' });

	return <Albums albums={albums} />;
}
