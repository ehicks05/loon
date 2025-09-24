import { RPCHandler } from '@orpc/server/fetch';
import { RequestHeadersPlugin } from '@orpc/server/plugins';
import { createFileRoute } from '@tanstack/react-router';
import { auth } from '@/lib/auth';
import router from '@/orpc/router';

const handler = new RPCHandler(router, {
	plugins: [new RequestHeadersPlugin()],
});

async function handle({ request }: { request: Request }) {
	// const session = await auth.api.getSession({ headers: request.headers });
	// const user = session?.user;

	const { response } = await handler.handle(request, {
		prefix: '/api/rpc',
		context: {},
	});

	return response ?? new Response('Not Found', { status: 404 });
}

export const Route = createFileRoute('/api/rpc/$')({
	server: {
		handlers: {
			HEAD: handle,
			GET: handle,
			POST: handle,
			PUT: handle,
			PATCH: handle,
			DELETE: handle,
		},
	},
});
