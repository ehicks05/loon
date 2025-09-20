import { createFileRoute } from '@tanstack/react-router';
import GeneralSettings from '@/app/settings/GeneralSettings';

export const Route = createFileRoute('/settings')({
	component: RouteComponent,
});

function RouteComponent() {
	return <GeneralSettings />;
}
