import {
  type FastifyTRPCPluginOptions,
  fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { createContext } from "./trpc/context";
import { type AppRouter, appRouter } from "./trpc/router";
import cors from '@fastify/cors'

const server = fastify({
  maxParamLength: 5000,
});

server.register(cors)

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      // report to error monitoring
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

(async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
