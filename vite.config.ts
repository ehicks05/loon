import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
	plugins: [
		tanstackStart(),
		nitro(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
		tailwindcss(),
		viteReact(),
	],
});
