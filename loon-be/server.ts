import path from "node:path";
import { fileURLToPath } from "node:url";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import {
  type FastifyTRPCPluginOptions,
  fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify";
import { OAuth2RequestError, generateState } from "arctic";
import { eq } from "drizzle-orm";
import fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import { type Session, type User, generateIdFromEntropySize } from "lucia";
import { serializeCookie } from "oslo/cookie";
import { db } from "./db";
import { userTable } from "./drizzle/lucia";
import { github } from "./lucia/github";
import { lucia } from "./lucia/lucia";
import { createContext } from "./trpc/context";
import { type AppRouter, appRouter } from "./trpc/router";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const server = fastify({
  maxParamLength: 5000,
});

server.register(cors, { origin: true });
server.register(cookie);

server.register(fastifyStatic, {
  root: path.join(__dirname, "/static"),
});

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

server.get("/poll", (req, res) => res.send({ success: true }));
server.get("/media", (req, res) => res.sendFile("test.flac", "", {}));

server.get("/login/github", async (req, res) => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state);
  res.header(
    "set-cookie",
    serializeCookie("github_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    }),
  );
  res.send(url.toString());
});

interface GitHubUser {
  id: string;
  login: string;
}

type GithubCallbackRequest = FastifyRequest<{
  Querystring: {
    code?: string;
    state?: string;
  };
}>;

server.get(
  "/login/github/callback",
  // {
  //   schema: {
  //     querystring: {
  //       type: "object",
  //       properties: { code: { type: "string" }, state: { type: "string" } },
  //     },
  //   },
  // },
  async (req: GithubCallbackRequest, res) => {
    const code = req.query.code?.toString() ?? null;
    const state = req.query.state?.toString() ?? null;
    const storedState = req.cookies.github_oauth_state ?? null;

    if (!code || !state || !storedState || state !== storedState) {
      console.log(code, state, storedState);
      res.status(400).send();
      return;
    }
    console.log({ code, state, storedState });

    try {
      console.log("entering try blocks");
      const tokens = await github.validateAuthorizationCode(code);
      console.log({ tokens });
      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const githubUser = (await githubUserResponse.json()) as
        | GitHubUser
        | undefined;
      if (!githubUser?.id) {
        res.status(400).send();
        return;
      }

      console.log({ githubUser });

      const existingUser = (
        await db
          .select()
          .from(userTable)
          .where(eq(userTable.githubId, Number(githubUser.id)))
      )?.[0];

      if (existingUser) {
        const session = await lucia.createSession(existingUser.id, {});
        console.log("existing user");
        return res
          .header(
            "Set-Cookie",
            lucia.createSessionCookie(session.id).serialize(),
          )
          .send();
      }

      const userId = generateIdFromEntropySize(10); // 16 characters long

      await db.insert(userTable).values({
        id: userId,
        githubId: Number(githubUser.id),
        username: githubUser.login,
        isAdmin: false,
      });

      const session = await lucia.createSession(userId, {});
      console.log("created user");
      return res
        .header("Set-Cookie", lucia.createSessionCookie(session.id).serialize())
        .send();
    } catch (e) {
      // the specific error message depends on the provider
      if (e instanceof OAuth2RequestError) {
        // invalid code
        console.log(e);

        res.status(400).send();
        return;
      }
      console.log(e);
      console.log(code, state, storedState);
      res.status(500).send();
      return;
    }
  },
);

export async function validateRequest(
  req: FastifyRequest,
  res: FastifyReply,
): Promise<{ user: User; session: Session } | { user: null; session: null }> {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }
  const result = await lucia.validateSession(sessionId);
  if (result.session?.fresh) {
    res.header(
      "Set-Cookie",
      lucia.createSessionCookie(result.session.id).serialize(),
    );
  }
  if (!result.session) {
    res.header("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }
  return result;
}

server.post("/logout", async (req, res) => {
  const { session } = await validateRequest(req, res);
  if (!session) {
    res.status(401).send();
    return;
  }
  await lucia.invalidateSession(session.id);
  return res
    .header("Set-Cookie", lucia.createBlankSessionCookie().serialize())
    .status(200)
    .send();
});

(async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
