import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { validateRequest } from '../utils/validate.js';

export const createTRPCContext = async ({
	req,
	res,
}: CreateExpressContextOptions) => {
	const { user } = await validateRequest(req, res);

	return { user };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
