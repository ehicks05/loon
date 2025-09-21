import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import Search from './-components/Search';

export const Route = createFileRoute('/search/')({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		library: { tracks },
	} = useLoaderData({ from: '__root__' });

	return <Search tracks={tracks} />;
}
