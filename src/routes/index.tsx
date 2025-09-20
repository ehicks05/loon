import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: Index,
});

function Index() {
	const navigate = useNavigate();
	navigate({ to: '/search' });
}
