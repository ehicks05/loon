import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../loon-be/src/trpc/router";

export const trpc = createTRPCReact<AppRouter>();
