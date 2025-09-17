import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute('/api/hello').methods({
	GET: async ({ request }) => {
		return new Response('Hello, World!');
	},
});
