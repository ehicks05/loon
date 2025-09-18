import { os } from '@orpc/server';
import type { RequestHeadersPluginContext } from '@orpc/server/plugins';
import { auth } from '@/lib/auth';

interface ORPCContext extends RequestHeadersPluginContext {}

const _base = os.$context<ORPCContext>();

interface ContextUser {
	id: string;
	role?: string | null;
}

export const base = _base.use(async ({ context, next }) => {
	const user = context.reqHeaders
		? (await auth.api.getSession({ headers: context.reqHeaders }))?.user
		: undefined;

	return next({
		context: {
			user,
		},
	});
});
