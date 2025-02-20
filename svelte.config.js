import adapter from 'sveltekit-adapter-chrome-extension';
import {
	vitePreprocess
} from '@sveltejs/vite-plugin-svelte';

const manifest = process.env.DEV_WATCH === "true" ? "dev.manifest.json" : "manifest.json"
console.log(`manifest file: ${manifest}`)

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown
			pages: "dist",
			assets: "dist",
			fallback: null,
			precompress: false,
			manifest,
		}),
		appDir: 'app',
	},
};

export default config;