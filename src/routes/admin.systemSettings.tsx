import { createFileRoute } from '@tanstack/react-router';
import SystemSettings from '@/app/admin/SystemSettings';

export const Route = createFileRoute('/admin/systemSettings')({
	component: RouteComponent,
});

function RouteComponent() {
	return <SystemSettings />;
}
