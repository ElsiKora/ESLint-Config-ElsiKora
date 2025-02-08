import { beforeEach, describe, expect, it, vi } from "vitest";

const MOCK_PATH: string = "../../../../infrastructure/constant/utility/plugin-map.constant";

describe("FormatRuleNameUtility", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	// Basic rule name transformation
	it("should transform simple plugin rule names", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				import: "imports",
				"typescript-eslint": "typescript",
			},
		}));

		const module: {
			formatRuleName(ruleName: string): string;
		} = await import("../../../../infrastructure/utility/format-rule-name.utility");
		const formatRuleName: (ruleName: string) => string = module.formatRuleName.bind(module);

		expect(formatRuleName("typescript-eslint/no-explicit-any")).toBe("typescript/no-explicit-any");
		expect(formatRuleName("import/no-duplicates")).toBe("imports/no-duplicates");
	});

	// Handle scoped package names
	it("should correctly handle rules with @ symbol prefixes", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@scope/plugin": "scoped",
				"@typescript-eslint": "typescript",
			},
		}));

		const module: {
			formatRuleName(ruleName: string): string;
		} = await import("../../../../infrastructure/utility/format-rule-name.utility");
		const formatRuleName: (ruleName: string) => string = module.formatRuleName.bind(module);

		expect(formatRuleName("@typescript-eslint/no-explicit-any")).toBe("typescript/no-explicit-any");
		expect(formatRuleName("@scope/plugin/custom-rule")).toBe("scoped/custom-rule");
	});

	// Rules not in the plugin map
	it("should return unchanged rule names when not found in plugin map", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@typescript-eslint": "typescript",
			},
		}));

		const module: {
			formatRuleName(ruleName: string): string;
		} = await import("../../../../infrastructure/utility/format-rule-name.utility");
		const formatRuleName: (ruleName: string) => string = module.formatRuleName.bind(module);

		expect(formatRuleName("custom-plugin/rule")).toBe("custom-plugin/rule");
		expect(formatRuleName("eslint/no-unused-vars")).toBe("eslint/no-unused-vars");
	});

	// Handle longer plugin names first
	it("should prioritize longer plugin names in transformation", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@typescript-eslint": "typescript",
				"@typescript-eslint/special": "typescript-special",
			},
		}));

		const module: {
			formatRuleName(ruleName: string): string;
		} = await import("../../../../infrastructure/utility/format-rule-name.utility");
		const formatRuleName: (ruleName: string) => string = module.formatRuleName.bind(module);

		expect(formatRuleName("@typescript-eslint/special/rule")).toBe("typescript-special/rule");
		expect(formatRuleName("@typescript-eslint/no-explicit-any")).toBe("typescript/no-explicit-any");
	});

	// Handle rules without plugin prefix
	it("should handle rules without plugin prefix", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@typescript-eslint": "typescript",
			},
		}));

		const module: {
			formatRuleName(ruleName: string): string;
		} = await import("../../../../infrastructure/utility/format-rule-name.utility");
		const formatRuleName: (ruleName: string) => string = module.formatRuleName.bind(module);

		expect(formatRuleName("no-console")).toBe("no-console");
		expect(formatRuleName("camelcase")).toBe("camelcase");
	});

	// Handle empty plugin map
	it("should handle empty plugin map", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {},
		}));

		const module: {
			formatRuleName(ruleName: string): string;
		} = await import("../../../../infrastructure/utility/format-rule-name.utility");
		const formatRuleName: (ruleName: string) => string = module.formatRuleName.bind(module);

		expect(formatRuleName("@typescript-eslint/no-explicit-any")).toBe("@typescript-eslint/no-explicit-any");
		expect(formatRuleName("import/no-duplicates")).toBe("import/no-duplicates");
	});

	// Handle special characters in rule names
	it("should handle special characters in rule names", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@special-chars": "special",
			},
		}));

		const module: {
			formatRuleName(ruleName: string): string;
		} = await import("../../../../infrastructure/utility/format-rule-name.utility");
		const formatRuleName: (ruleName: string) => string = module.formatRuleName.bind(module);

		expect(formatRuleName("@special-chars/rule-with.dot")).toBe("special/rule-with.dot");
		expect(formatRuleName("@special-chars/rule-with_underscore")).toBe("special/rule-with_underscore");
	});

	// Multiple transformations in one rule name
	it("should handle only first matching transformation in rule name", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {
				"plugin-a": "renamed-a",
				"plugin-b": "renamed-b",
			},
		}));

		const module: {
			formatRuleName(ruleName: string): string;
		} = await import("../../../../infrastructure/utility/format-rule-name.utility");
		const formatRuleName: (ruleName: string) => string = module.formatRuleName.bind(module);

		expect(formatRuleName("plugin-a/rule/plugin-b/nested")).toBe("renamed-a/rule/plugin-b/nested");
	});
});
