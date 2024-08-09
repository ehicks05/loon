import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../loon-be/trpc/router";

export const trpc = createTRPCReact<AppRouter>();
