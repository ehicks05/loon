import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createTRPCContext } from './context';
import { albumRouter } from './routers/album.js';
import { artistRouter } from './routers/artist.js';
import { libraryRouter } from './routers/library.js';
import { playlistRouter } from './routers/playlist.js';
import { router } from './trpc.js';

export const appRouter = router({
	album: albumRouter,
	artist: artistRouter,
	playlist: playlistRouter,
	library: libraryRouter,
});

export type AppRouter = typeof appRouter;

export const trpcMiddleWare = createExpressMiddleware({
	router: appRouter,
	createContext: createTRPCContext,
});
