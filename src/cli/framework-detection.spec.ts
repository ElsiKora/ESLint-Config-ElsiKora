import type { IDetectedFramework } from "./types";

import { describe, expect, it } from "vitest";

import { generateLintCommands } from "./framework-detection";

describe("generateLintCommands", () => {
	it("should generate correct lint and fix commands for provided framework and paths", () => {
		const framework: IDetectedFramework = {
			framework: {
				ignorePaths: { directories: [], patterns: [] },
				lintPaths: ["src/**/*"],
				name: "test",
				packageIndicators: [],
			},
			hasTypescript: false,
		};
		const result = generateLintCommands(framework, [], false, false);
		expect(result.lintCommand).toBe("eslint src");
		expect(result.lintFixCommand).toBe("eslint src --fix");
	});

	it("should include stylelint commands when includeStylelint is true", () => {
		const framework = {
			framework: {
				ignorePaths: { directories: [], patterns: [] },
				lintPaths: ["src/**/*"],
				name: "test",
				packageIndicators: [],
			},
			hasTypescript: false,
		};
		const result = generateLintCommands(framework, [], true, false);
		expect(result.lintCommand).toContain('stylelint "**/*.{css,scss,less}"');
		expect(result.lintFixCommand).toContain('stylelint "**/*.{css,scss,less}" --fix');
	});

	it("should use customPaths for linting when framework is null", () => {
		const customPaths = ["custom/path/**/*"];
		const result = generateLintCommands(null, customPaths, false, false);
		expect(result.lintCommand).toBe("eslint custom/path");
		expect(result.lintFixCommand).toBe("eslint custom/path --fix");
	});

	it("should process empty customPaths without errors", () => {
		const result = generateLintCommands(null, [], false, false);
		expect(result.lintCommand).toBe("eslint ");
		expect(result.lintFixCommand).toBe("eslint  --fix");
	});

	it('should correctly handle paths without "/*" pattern', () => {
		const framework: IDetectedFramework = {
			framework: {
				ignorePaths: { directories: [], patterns: [] },
				lintPaths: ["src"],
				name: "test",
				packageIndicators: [],
			},
			hasTypescript: false,
		};
		const result = generateLintCommands(framework, [], false, false);
		expect(result.lintCommand).toBe("eslint src");
		expect(result.lintFixCommand).toBe("eslint src --fix");
	});
});
