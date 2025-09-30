import path from "path";
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin';

export default defineConfig({
	server: {
		port: 3000,
		host: '0.0.0.0',
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	plugins: [
		tsConfigPaths(),
		tanstackStart({ public: { base: '/images', dir: 'public' } }),
		// nitroV2Plugin({
		// 	preset: 'node-server',
		// 	compatibilityDate: '2025-09-25',
		// }),
		nitro({
			config: {
				preset: 'node-server',
				compatibilityDate: '2025-09-25'
			},
		}),
		tailwindcss(),
		viteReact(),
	],
});
