import { AuthView } from '@daveyplate/better-auth-ui';
import { createFileRoute } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/auth/$authView')({
	component: RouteComponent,
});

function RouteComponent() {
	const { authView } = Route.useParams();

	return (
		<main className="container flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
			<AuthView pathname={authView} />

			<p
				className={cn(
					['callback', 'sign-out'].includes(authView) && 'hidden',
					'text-muted-foreground text-xs',
				)}
			>
				Powered by{' '}
				<a
					className="text-warning underline"
					href="https://better-auth.com"
					target="_blank"
					rel="noreferrer"
				>
					better-auth.
				</a>
			</p>
		</main>
	);
}
