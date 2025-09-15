import type { AppRouter } from '@ehicks05/loon-be/router';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();
