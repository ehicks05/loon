import { os } from '@orpc/server';
import * as z from 'zod';
import { fetchLibrary } from '@/drizzle/fetchLibrary';

export const library = os.input(z.object({})).handler(() => {
	return fetchLibrary();
});
