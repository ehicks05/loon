import { createFileRoute } from '@tanstack/react-router';
import { Albums } from '@/app/Albums';

export const Route = createFileRoute('/albums')({
	component: RouteComponent,
});

function RouteComponent() {
	return <Albums />;
}
