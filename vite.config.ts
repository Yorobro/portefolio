import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    // Always serve the dev site on the same port. If 5173 is busy, fail loudly
    // instead of silently sliding to 5174 — that way an orphaned dev server is
    // surfaced explicitly and the bookmarked URL stays valid.
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
});
