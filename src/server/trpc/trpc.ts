import { initTRPC, TRPCError } from '@trpc/server';
import type { TRPCContext } from './context.js';

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
	const { ctx } = opts;
	if (!ctx.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	return opts.next({
		ctx: {
			user: ctx.user,
		},
	});
});

export const adminProcedure = t.procedure.use(async function isAdmin(opts) {
	const { ctx } = opts;
	if (!ctx.user) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
	if (!ctx.user.isAdmin) {
		throw new TRPCError({ code: 'FORBIDDEN' });
	}

	return opts.next({
		ctx: {
			user: ctx.user,
		},
	});
});
