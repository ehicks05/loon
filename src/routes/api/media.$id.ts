import * as fs from 'node:fs';
import { createFileRoute } from '@tanstack/react-router';
import { eq } from 'drizzle-orm';
import { db } from '@/drizzle/db';
import { tracks } from '@/drizzle/schema/main';

/**
    const { id } = req.query;
    if (!id) {
      return res.status(400).send();
    }
    const track = await db.query.tracks.findFirst({ where: eq(tracks.id, id) });
    const path = track?.path;
    if (!path) {
      return res.status(404).send();
    }
    const fileExists = await doesFileExist(path);
    if (!fileExists) {
      return res.status(404).send();
    }
    return res.sendFile(path, { acceptRanges: true });
 */

export const Route = createFileRoute('/api/media/$id')({
	server: {
		handlers: {
			GET: async ({ params: { id } }) => {
				if (!id) {
					throw new Error('BAD_REQUEST');
				}

				const track = await db.query.tracks.findFirst({ where: eq(tracks.id, id) });
				const path = track?.path;
				if (!path) {
					throw new Response('Path not found', { status: 404 });
				}

				if (!fs.existsSync(path)) {
					throw new Response('File not found', { status: 404 });
				}

				const stat = fs.statSync(path);
				const fileSize = stat.size;

				const headers = new Headers();
				// headers.set('Content-Type', 'application/octet-stream'); // Or the correct MIME type
				// headers.set('Content-Disposition', 'inline');
				headers.set('Content-Length', fileSize.toString());

				const fileStream = fs.createReadStream(path);

				// Create a ReadableStream from the Node.js stream
				const webStream = new ReadableStream({
					start(controller) {
						fileStream.on('data', (chunk) => {
							controller.enqueue(chunk);
						});
						fileStream.on('end', () => {
							controller.close();
						});
						fileStream.on('error', (err) => {
							controller.error(err);
						});
					},
				});

				return new Response(webStream, { headers });
			},
		},
	},
});
