import { ORPCError, os } from '@orpc/server';
import type { RequestHeadersPluginContext } from '@orpc/server/plugins';
import { auth } from '@/lib/auth';

interface ORPCContext extends RequestHeadersPluginContext {}

export const base = os.$context<ORPCContext>();

export const _public = base.middleware(async ({ context, next }) => {
	const user = context.reqHeaders
		? (await auth.api.getSession({ headers: context.reqHeaders }))?.user
		: undefined;

	return next({ context: { user } });
});

export const isLoggedIn = base.middleware(async ({ context, next }) => {
	const user = context.reqHeaders
		? (await auth.api.getSession({ headers: context.reqHeaders }))?.user
		: undefined;

	if (user) {
		return next({ context: { user } });
	}

	throw new ORPCError('UNAUTHORIZED');
});

export const isAdmin = base.middleware(async ({ context, next }) => {
	const user = context.reqHeaders
		? (await auth.api.getSession({ headers: context.reqHeaders }))?.user
		: undefined;

	if (user?.role === 'admin') {
		return next({ context: { user } });
	}

	throw new ORPCError('UNAUTHORIZED');
});
