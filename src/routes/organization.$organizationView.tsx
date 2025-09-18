import { OrganizationView } from '@daveyplate/better-auth-ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/organization/$organizationView')({
	component: RouteComponent,
});

function RouteComponent() {
	const { organizationView } = Route.useParams();
	return (
		<main className="container p-4 md:p-6">
			<OrganizationView pathname={organizationView} />
		</main>
	);
}