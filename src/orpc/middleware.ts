import { ORPCError } from '@orpc/server';
import { base } from './context';

export const isLoggedIn = base.middleware(async ({ context, next }) => {
	if (context.user) {
		return next();
	}

	throw new ORPCError('UNAUTHORIZED');
});

export const isAdmin = base.middleware(async ({ context, next }) => {
	if (context.user?.role === 'admin') {
		return next();
	}

	throw new ORPCError('UNAUTHORIZED');
});
