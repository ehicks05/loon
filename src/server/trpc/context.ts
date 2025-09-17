import type * as trpcExpress from "@trpc/server/adapters/express";
import { validateRequest } from "../../../src/server/utils/validate.js";

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const { user } = await validateRequest(req, res);

  return { user };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
