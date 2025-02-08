import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/test/e2e/**/*.test.ts"],
		exclude: ["node_modules/**/*"],
		root: ".",
		watch: false,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	publicDir: false,
});
