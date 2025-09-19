import { createFileRoute } from '@tanstack/react-router';
import Artists from '@/app/Artists';

export const Route = createFileRoute('/artists')({
	component: RouteComponent,
});

function RouteComponent() {
	// return <Artists />;
}
