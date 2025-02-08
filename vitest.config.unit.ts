// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/test/e2e/**/*.test.ts"], // Указываем где искать тесты
		exclude: ["node_modules/**/*"],
		root: ".", // Корневая директория проекта
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"), // Опционально, для удобства импортов
		},
	},
	publicDir: false,
});
