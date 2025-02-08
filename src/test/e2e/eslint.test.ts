import type { ESLint } from "eslint";

import { describe, expect, it } from "vitest";
import { getFixturePath } from "./helper/get-fixture-path.helper";
import { createEsLintInstance } from "./helper/create-eslint-instance.helper";

describe("ESLint Config E2E Tests", () => {
	describe("TypeScript Configuration", () => {
		it("should pass valid TypeScript code", async () => {
			let eslint: ESLint = await createEsLintInstance({
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("typescript/valid/clean.fixture.ts")]);

			expect(results[0].errorCount).toBe(0);
			expect(results[0].messages).toHaveLength(0);
		});

		it("should enforce naming conventions", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("typescript/invalid/naming-convention.fixture.ts")]);

			expect(results[0].errorCount).toBeGreaterThan(0);
			expect(results[0].messages.some((msg) => msg.ruleId === "@elsikora-typescript/naming-convention")).toBe(true);
		});

		it("should enforce function return types", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("typescript/invalid/explicit-function-return-type.fixture.ts")]);

			expect(results[0].messages.some((msg) => msg.ruleId === "@elsikora-typescript/explicit-function-return-type")).toBe(true);
		});
	});

	describe("React Configuration", () => {
		it("should pass valid JSX code", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withReact: true,
			});

			const results = await eslint.lintFiles([getFixturePath("react/valid/Clean.fixture.jsx")]);

			expect(results[0].warningCount).toBe(0);
			expect(results[0].errorCount).toBe(0);
		});

		it("should enforce hooks rules", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withReact: true,
			});

			const results = await eslint.lintFiles([getFixturePath("react/invalid/no-direct-set-state-in-use-effect.fixture.jsx")]);

			expect(results[0].messages.some((msg) => msg.ruleId?.startsWith("@elsikora-react/hooks-extra"))).toBe(true);
		});
	});

	describe("NestJS Configuration", () => {
		it("should pass valid NestJS controller", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withNest: true,
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("nest/valid/clean.controller.fixture.ts")]);

			expect(results[0].messages.filter((msg) => msg.ruleId?.startsWith("@elsikora/nest/")).length).toBe(0);
		});

		it("should enforce API response decorators", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withNest: true,
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("nest/invalid/api-method-should-specify-api-response.controller.fixture.ts")]);

			expect(results[0].messages.some((msg) => msg.ruleId === "@elsikora/nest/2/api-method-should-specify-api-response")).toBe(true);
		});

		it("should validate controller decorators", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withNest: true,
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("nest/invalid/controllers-should-supply-api-tags.controller.fixture.ts")]);

			expect(results[0].messages.some((msg) => msg.ruleId === "@elsikora/nest/2/controllers-should-supply-api-tags")).toBe(true);
		});

		it("should validate controller decorators", async () => {
			const eslint: ESLint = await createEsLintInstance({
				withNest: true,
				withTypescript: true,
			});

			const results = await eslint.lintFiles([getFixturePath("nest/invalid/decorator-array-items.module.fixture.ts")]);

			expect(results[0].messages.some((msg) => msg.ruleId === "@elsikora/nest/1/decorator-array-items")).toBe(true);
		});
	});
});
