import { describe, expect, it } from "vitest";

import javascriptConfig from "./config/javascript";

import { createConfig } from "./index";

describe("ESLint Config Generator", () => {
	describe("createConfig", () => {
		it("should handle large number of configurations without performance issues", () => {
			const start = performance.now();

			const result = createConfig({
				withCheckFile: true,
				withJavascript: true,
				withJson: true,
				withNest: true,
				withNode: true,
				withPackageJson: true,
				withPerfectionist: true,
				withPrettier: true,
				withReact: true,
				withRegexp: true,
				withSonar: true,
				withStylistic: true,
				withTailwindCss: true,
				withTypeorm: true,
				withTypescript: true,
				withUnicorn: true,
				withYaml: true,
			});
			const end = performance.now();
			expect(result.length).toBeGreaterThan(0);
			expect(end - start).toBeLessThan(100);
		});
	});

	it("should handle all options set to false without errors", () => {
		const result = createConfig({
			withCheckFile: false,
			withJavascript: false,
			withJson: false,
			withNest: false,
			withNode: false,
			withPackageJson: false,
			withPerfectionist: false,
			withPrettier: false,
			withReact: false,
			withRegexp: false,
			withSonar: false,
			withStylistic: false,
			withTailwindCss: false,
			withTypeorm: false,
			withTypescript: false,
			withUnicorn: false,
			withYaml: false,
		});
		expect(result).toEqual([]);
	});

	it("should return an empty array when no options are provided", () => {
		const result = createConfig();
		expect(result).toEqual([]);
	});

	it("should include javascriptConfig when javascript option is true", () => {
		const result = createConfig({ withJavascript: true });
		expect(result).toContain(javascriptConfig[0]);
	});

	it("should handle undefined options gracefully", () => {
		const result = createConfig();
		expect(result).toEqual([]);
	});
});
