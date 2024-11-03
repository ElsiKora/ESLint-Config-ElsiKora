import { describe, expect, it } from "vitest";
import { createConfig } from "./index";
import javascriptConfig from "./config/javascript";

describe("ESLint Config Generator", () => {
	describe("createConfig", () => {
		it("should handle large number of configurations without performance issues", () => {
			const start = performance.now();
			const result = createConfig({
				checkFile: true,
				javascript: true,
				json: true,
				nest: true,
				node: true,
				packageJson: true,
				perfectionist: true,
				prettier: true,
				react: true,
				regexp: true,
				sonar: true,
				stylistic: true,
				tailwindCss: true,
				typeorm: true,
				typescript: true,
				unicorn: true,
				yaml: true,
			});
			const end = performance.now();
			expect(result.length).toBeGreaterThan(0);
			expect(end - start).toBeLessThan(100);
		});
	});

	it("should handle all options set to false without errors", () => {
		const result = createConfig({
			checkFile: false,
			javascript: false,
			json: false,
			nest: false,
			node: false,
			packageJson: false,
			perfectionist: false,
			prettier: false,
			react: false,
			regexp: false,
			sonar: false,
			stylistic: false,
			tailwindCss: false,
			typeorm: false,
			typescript: false,
			unicorn: false,
			yaml: false,
		});
		expect(result).toEqual([]);
	});

	it("should return an empty array when no options are provided", () => {
		const result = createConfig();
		expect(result).toEqual([]);
	});

	it("should include javascriptConfig when javascript option is true", () => {
		const result = createConfig({ javascript: true });
		expect(result).toContain(javascriptConfig[0]);
	});

	it("should handle undefined options gracefully", () => {
		const result = createConfig(undefined);
		expect(result).toEqual([]);
	});
});
