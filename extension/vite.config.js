import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	plugins: [
		viteStaticCopy({
			targets: [
				{ src: "hello.html", dest: "." },
				{ src: "manifest.json", dest: "." },
				{ src: "cc.png", dest: "." },
				{ src: "popup.css", dest: "." },
			],
		}),
	],
	build: {
		outDir: "dist",
		rollupOptions: {
			input: {
				popup: resolve(__dirname, "popup.js"),
			},
			output: {
				entryFileNames: "[name].js",
			},
		},
	},
});
