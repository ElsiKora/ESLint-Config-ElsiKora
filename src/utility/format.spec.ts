import { describe, expect, it } from "vitest";

import { formatConfig, formatRuleName } from "./format";

describe("formatRuleName", () => {
	it("should convert rule names with known prefixes to new prefixes", () => {
		const result = formatRuleName("@eslint-react/dom/some-rule");
		expect(result).toBe("@elsikora-react/dom/some-rule");
	});

	it("should return the original rule name when no matching prefix is found", () => {
		const result = formatRuleName("unknown-prefix/some-rule");
		expect(result).toBe("unknown-prefix/some-rule");
	});

	it("should return the original rule name when no prefix is present", () => {
		const result = formatRuleName("some-rule");
		expect(result).toBe("some-rule");
	});

	it("should return the original rule name when it is a substring of a known prefix", () => {
		const result = formatRuleName("@eslint/some-rule");
		expect(result).toBe("@eslint/some-rule");
	});

	it("should convert rule names with special characters in the prefix correctly", () => {
		const result = formatRuleName("@typescript-eslint/some-rule");
		expect(result).toBe("@elsikora-typescript/some-rule");
	});
});

describe("formatConfig", () => {
	it("should format plugin names correctly when plugins are present", () => {
		const configs = [
			{
				plugins: {
					"@eslint-react": {},
					jsonc: {},
				},
			},
		];

		const expected = [
			{
				plugins: {
					"@elsikora-react": {},
					"elsikora-json": {},
				},
			},
		];
		const result = formatConfig(configs);
		expect(result).toEqual(expected);
	});

	it("should format rule names correctly when rules are present", () => {
		const configs = [
			{
				rules: {
					"@eslint-react/rule-name": "error",
					"jsonc/rule-name": "warn",
				},
			},
		];

		const expected = [
			{
				rules: {
					"@elsikora-react/rule-name": "error",
					"elsikora-json/rule-name": "warn",
				},
			},
		];
		// @ts-ignore
		const result = formatConfig(configs);
		expect(result).toEqual(expected);
	});

	it("should return an empty array when input is an empty array", () => {
		const configs: Array<any> = [];
		const expected: Array<any> = [];
		const result = formatConfig(configs);
		expect(result).toEqual(expected);
	});

	it("should return the same configuration when no plugins or rules are present", () => {
		const configs = [{}];
		const expected = [{}];
		const result = formatConfig(configs);
		expect(result).toEqual(expected);
	});

	it("should format plugins correctly when no rules are present", () => {
		const configs = [
			{
				plugins: {
					"@eslint-react": {},
				},
			},
		];

		const expected = [
			{
				plugins: {
					"@elsikora-react": {},
				},
			},
		];
		const result = formatConfig(configs);
		expect(result).toEqual(expected);
	});
});
