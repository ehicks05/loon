import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { orpc } from '@/orpc/client';

export const Route = createFileRoute('/')({
	component: Index,
});

function Index() {
	const { data } = useQuery(orpc.library.queryOptions({ input: {} }));

	return (
		<div className="flex flex-col min-h-screen">
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
