import { os } from '@orpc/server';
import * as z from 'zod';

const todos = [
	{ id: 1, name: 'Get groceries' },
	{ id: 2, name: 'Buy a new phone' },
	{ id: 3, name: 'Finish the project' },
];

export const listLibrary = os.input(z.object({})).handler(() => {
	return todos;
});
