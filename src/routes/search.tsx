import { createFileRoute } from '@tanstack/react-router';
import Search from '@/app/Search';

export const Route = createFileRoute('/search')({
	component: RouteComponent,
});

function RouteComponent() {
	return <Search />;
}
