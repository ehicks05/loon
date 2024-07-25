import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { validateRequest } from "../server";

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const { user } = await validateRequest(req, res);

  return { req, res, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
