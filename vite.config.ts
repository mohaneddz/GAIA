import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';

import Pages from 'vite-plugin-pages';
import react from '@vitejs/plugin-react';
import path from 'path';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
    Pages({
      dirs: ['src/dirs'],
    }),
	] as any,

	clearScreen: false,

	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},

	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421,
			  }
			: undefined,
		watch: {
			ignored: ['**/src-tauri/**', '**/server/**'],
		},
	},
});
