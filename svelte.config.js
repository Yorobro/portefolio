import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			out: 'build',
			precompress: true
		}),
		alias: {
			$domain: 'src/lib/domain',
			$application: 'src/lib/application',
			$infrastructure: 'src/lib/infrastructure',
			$presentation: 'src/lib/presentation',
			$components: 'src/lib/components',
			$styles: 'src/lib/styles',
			$server: 'src/lib/server'
		}
	}
};

export default config;
