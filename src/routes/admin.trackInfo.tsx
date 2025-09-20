import { createFileRoute } from '@tanstack/react-router';
import { TrackInfo } from '@/app/TrackInfo';

export const Route = createFileRoute('/admin/trackInfo')({
	component: RouteComponent,
});

function RouteComponent() {
	return <TrackInfo />;
}
