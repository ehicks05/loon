import path from "path";
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	server: {
		port: 3000,
		host: '0.0.0.0',
	},
	resolve: {
    alias: {
      // @ts-ignore
      "@": path.resolve(__dirname, "./src"),
    },
  },
	plugins: [
		tsConfigPaths(),
		tanstackStart(),
		tailwindcss(),
		viteReact(),
	],
});
