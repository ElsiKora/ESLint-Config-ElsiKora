import type { ESLint, Linter } from "eslint";

import { beforeEach, describe, expect, it, vi } from "vitest";

const MOCK_PATH: string = "../../../../infrastructure/constant/utility/plugin-map.constant";

describe("FormatConfigUtility", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	// Correctly remaps plugin names according to PLUGIN_MAP entries
	it("should remap plugin names based on PLUGIN_MAP entries", async () => {
		const mockPlugin: ESLint.Plugin = {};

		const mockConfig: Linter.Config = {
			plugins: {
				"@typescript-eslint": mockPlugin,
				import: mockPlugin,
			},
		};

		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@typescript-eslint": "typescript",
				import: "imports",
			},
		}));

		const module: {
			formatConfig(configs: Array<Linter.Config>): Array<Linter.Config>;
		} = await import("../../../../infrastructure/utility/format-config.utility");
		const formatConfig: (configs: Array<Linter.Config>) => Array<Linter.Config> = module.formatConfig.bind(module);
		const result: Array<Linter.Config> = formatConfig([mockConfig]);

		expect(result[0].plugins).toEqual({
			imports: mockPlugin,
			typescript: mockPlugin,
		});
	});

	// Handle empty configs array input
	it("should return empty array when input is empty", async () => {
		vi.doMock(MOCK_PATH, () => ({
			default: {},
		}));

		const module: {
			formatConfig(configs: Array<Linter.Config>): Array<Linter.Config>;
		} = await import("../../../../infrastructure/utility/format-config.utility");
		const formatConfig: (configs: Array<Linter.Config>) => Array<Linter.Config> = module.formatConfig.bind(module);
		const result: Array<Linter.Config> = formatConfig([]);

		expect(result).toEqual([]);
	});

	// Preserves plugins that are not in PLUGIN_MAP
	it("should preserve plugins not listed in PLUGIN_MAP", async () => {
		const mockPlugin: ESLint.Plugin = {};

		const mockConfig: Linter.Config = {
			plugins: {
				"@typescript-eslint": mockPlugin,
				"custom-plugin": mockPlugin,
			},
		};

		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@typescript-eslint": "typescript",
			},
		}));

		const module: {
			formatConfig(configs: Array<Linter.Config>): Array<Linter.Config>;
		} = await import("../../../../infrastructure/utility/format-config.utility");
		const formatConfig: (configs: Array<Linter.Config>) => Array<Linter.Config> = module.formatConfig.bind(module);
		const result: Array<Linter.Config> = formatConfig([mockConfig]);

		expect(result[0].plugins).toEqual({
			"custom-plugin": mockPlugin,
			typescript: mockPlugin,
		});
	});

	// Handle plugin names starting with @ symbol and organization tag
	it("should correctly handle plugin names starting with @ symbol", async () => {
		const mockPlugin: ESLint.Plugin = {};

		const mockConfig: Linter.Config = {
			plugins: {
				"@some-plugin/linter": mockPlugin,
				"@typescript-eslint": mockPlugin,
				"some-plugin": mockPlugin,
			},
		};

		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@some-plugin/linter": "typescript/linter",
				"@typescript-eslint": "typescript",
				"some-plugin": "somePlugin",
			},
		}));

		const module: {
			formatConfig(configs: Array<Linter.Config>): Array<Linter.Config>;
		} = await import("../../../../infrastructure/utility/format-config.utility");
		const formatConfig: (configs: Array<Linter.Config>) => Array<Linter.Config> = module.formatConfig.bind(module);
		const result: Array<Linter.Config> = formatConfig([mockConfig]);

		expect(result[0].plugins).toEqual({
			somePlugin: mockPlugin,
			typescript: mockPlugin,
			"typescript/linter": mockPlugin,
		});
	});

	// circullar renames test
	it("should handle circular renames in plugin names and rule prefixes", async () => {
		const mockPlugin: ESLint.Plugin = {};

		const mockConfig: Linter.Config = {
			plugins: {
				pluginA: mockPlugin,
				pluginB: mockPlugin,
			},
		};

		vi.doMock(MOCK_PATH, () => ({
			default: {
				pluginA: "pluginB",
				pluginB: "pluginA",
			},
		}));

		const module: {
			formatConfig(configs: Array<Linter.Config>): Array<Linter.Config>;
		} = await import("../../../../infrastructure/utility/format-config.utility");
		const formatConfig: (configs: Array<Linter.Config>) => Array<Linter.Config> = module.formatConfig.bind(module);
		const result: Array<Linter.Config> = formatConfig([mockConfig]);

		expect(result[0].plugins).toEqual({
			pluginA: mockPlugin,
			pluginB: mockPlugin,
		});
	});

	// Test rule prefix remapping
	it("should correctly remap rule prefixes based on PLUGIN_MAP entries", async () => {
		const mockConfig: Linter.Config = {
			rules: {
				"@typescript-eslint/no-explicit-any": ["error"],
				"custom-plugin/custom-rule": ["error"],
				"import/no-duplicates": ["warn"],
			},
		};

		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@typescript-eslint": "typescript",
				import: "imports",
			},
		}));

		const module: {
			formatConfig(configs: Array<Linter.Config>): Array<Linter.Config>;
		} = await import("../../../../infrastructure/utility/format-config.utility");
		const formatConfig: (configs: Array<Linter.Config>) => Array<Linter.Config> = module.formatConfig.bind(module);
		const result: Array<Linter.Config> = formatConfig([mockConfig]);

		expect(result[0].rules).toEqual({
			"custom-plugin/custom-rule": ["error"],
			"imports/no-duplicates": ["warn"],
			"typescript/no-explicit-any": ["error"],
		});
	});

	// Test handling configs with both plugins and rules
	it("should handle configs with both plugins and rules correctly", async () => {
		const mockPlugin: ESLint.Plugin = {};

		const mockConfig: Linter.Config = {
			plugins: {
				"@typescript-eslint": mockPlugin,
				import: mockPlugin,
			},
			rules: {
				"@typescript-eslint/no-explicit-any": ["error"],
				"import/no-duplicates": ["warn"],
			},
		};

		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@typescript-eslint": "typescript",
				import: "imports",
			},
		}));

		const module: {
			formatConfig(configs: Array<Linter.Config>): Array<Linter.Config>;
		} = await import("../../../../infrastructure/utility/format-config.utility");
		const formatConfig: (configs: Array<Linter.Config>) => Array<Linter.Config> = module.formatConfig.bind(module);
		const result: Array<Linter.Config> = formatConfig([mockConfig]);

		expect(result[0]).toEqual({
			plugins: {
				imports: mockPlugin,
				typescript: mockPlugin,
			},
			rules: {
				"imports/no-duplicates": ["warn"],
				"typescript/no-explicit-any": ["error"],
			},
		});
	});

	// Test handling of configs without plugins or rules
	it("should handle configs without plugins or rules", async () => {
		const mockConfig: Linter.Config = {
			languageOptions: {
				globals: {
					customVar: "readonly",
				},
			},
		};

		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@typescript-eslint": "typescript",
			},
		}));

		const module: {
			formatConfig(configs: Array<Linter.Config>): Array<Linter.Config>;
		} = await import("../../../../infrastructure/utility/format-config.utility");
		const formatConfig: (configs: Array<Linter.Config>) => Array<Linter.Config> = module.formatConfig.bind(module);
		const result: Array<Linter.Config> = formatConfig([mockConfig]);

		expect(result[0]).toEqual({
			languageOptions: {
				globals: {
					customVar: "readonly",
				},
			},
		});
	});

	// Test handling of multiple configs with different rule formats
	it("should handle multiple configs with different rule formats", async () => {
		const mockConfigs: Array<Linter.Config> = [
			{
				rules: {
					"@typescript-eslint/no-explicit-any": "error",
				},
			},
			{
				rules: {
					// eslint-disable-next-line @elsikora-typescript/naming-convention
					"import/no-duplicates": ["warn", { considerQueryString: true }],
				},
			},
		];

		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@typescript-eslint": "typescript",
				import: "imports",
			},
		}));

		const module: {
			formatConfig(configs: Array<Linter.Config>): Array<Linter.Config>;
		} = await import("../../../../infrastructure/utility/format-config.utility");
		const formatConfig: (configs: Array<Linter.Config>) => Array<Linter.Config> = module.formatConfig.bind(module);
		const result: Array<Linter.Config> = formatConfig(mockConfigs);

		expect(result).toEqual([
			{
				rules: {
					"typescript/no-explicit-any": "error",
				},
			},
			{
				rules: {
					// eslint-disable-next-line @elsikora-typescript/naming-convention
					"imports/no-duplicates": ["warn", { considerQueryString: true }],
				},
			},
		]);
	});

	// Test handling of nested rule configurations
	it("should preserve nested rule configurations when remapping", async () => {
		const mockConfig: Linter.Config = {
			rules: {
				"@typescript-eslint/naming-convention": [
					"error",
					{
						format: ["camelCase", "UPPER_CASE"],
						selector: "variable",
					},
				],
			},
		};

		vi.doMock(MOCK_PATH, () => ({
			default: {
				"@typescript-eslint": "typescript",
			},
		}));

		const module: {
			formatConfig(configs: Array<Linter.Config>): Array<Linter.Config>;
		} = await import("../../../../infrastructure/utility/format-config.utility");
		const formatConfig: (configs: Array<Linter.Config>) => Array<Linter.Config> = module.formatConfig.bind(module);
		const result: Array<Linter.Config> = formatConfig([mockConfig]);

		expect(result[0].rules).toEqual({
			"typescript/naming-convention": [
				"error",
				{
					format: ["camelCase", "UPPER_CASE"],
					selector: "variable",
				},
			],
		});
	});
});
