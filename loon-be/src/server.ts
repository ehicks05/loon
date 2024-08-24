import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import serveStatic from "serve-static";
import { router } from "./routes/index.js";
import { createContext } from "./trpc/context.js";
import { appRouter } from "./trpc/router.js";

const app = express();

const origins = ["https://loon.ehicks.net", "http://localhost:5173"];
app.use(cors({ origin: origins, credentials: true }));
app.use(cookieParser());
app.use(serveStatic("/"));

app.use("/", router);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(3000);
