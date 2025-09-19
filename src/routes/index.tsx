import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { orpc } from '@/orpc/client';
import Router from '@/Routes';

export const Route = createFileRoute('/')({
	component: Index,
});

function Index() {
	const { data } = useQuery(orpc.library.queryOptions());

	return (
		<div className="flex flex-col">
			{/* <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre> */}
			<Router />
		</div>
	);
}
