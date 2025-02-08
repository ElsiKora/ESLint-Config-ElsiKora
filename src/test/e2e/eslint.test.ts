import type { ESLint } from "eslint";

import { beforeAll, describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";

describe("ESLint Config E2E Tests", () => {
	describe("TypeScript Configuration", () => {
		let eslint: ESLint;

		beforeAll(async () => {
			eslint = await createEsLintInstance({
				withTypescript: true,
			});
		});

		it("should pass valid TypeScript code", async () => {
			console.log("EEE", await eslint);

			eslint = await createEsLintInstance({
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("typescript/valid/clean.fixture.ts")]);

			console.log("RESULT HUI", results[0].messages);
			expect(results[0].errorCount).toBe(0);
			expect(results[0].messages).toHaveLength(0);
		});
	});
});
