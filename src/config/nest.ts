import type { Linter } from "eslint";

import { fixupPluginRules } from "@eslint/compat";
import ngModuleSort from "eslint-plugin-ng-module-sort";
// @ts-expect-error
import nestJsTyped from "@elsikora/eslint-plugin-nestjs-typed";
import tseslint from "typescript-eslint";
export default [
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: "./tsconfig.json",
			},
		},
		plugins: {
			"@elsikora/nest/1": fixupPluginRules(ngModuleSort),
			// eslint-disable-next-line @elsikora-typescript/no-unsafe-argument
			"@elsikora/nest/2": fixupPluginRules(nestJsTyped),
		},
		rules: {
			"@elsikora/nest/1/decorator-array-items": [
				"error",
				{
					reverseSort: false,
				},
			],
			"@elsikora/nest/2/all-properties-are-whitelisted": "error",
			"@elsikora/nest/2/all-properties-have-explicit-defined": "error",
			"@elsikora/nest/2/api-enum-property-best-practices": "error",
			"@elsikora/nest/2/api-method-should-specify-api-operation": "off",
			"@elsikora/nest/2/api-method-should-specify-api-response": "error",
			"@elsikora/nest/2/api-methods-should-be-guarded": "off",
			"@elsikora/nest/2/api-property-matches-property-optionality": "error",
			"@elsikora/nest/2/api-property-returning-array-should-set-array": "error",
			"@elsikora/nest/2/controllers-should-supply-api-tags": "error",
			"@elsikora/nest/2/no-duplicate-decorators": "error",
			"@elsikora/nest/2/param-decorator-name-matches-route-param": "error",
			"@elsikora/nest/2/provided-injected-should-match-factory-parameters": "error",
			"@elsikora/nest/2/should-specify-forbid-unknown-values": "error",
			"@elsikora/nest/2/sort-module-metadata-arrays": "off",
			"@elsikora/nest/2/validate-nested-of-array-should-set-each": "error",
			"@elsikora/nest/2/validated-non-primitive-property-needs-type-decorator": "error",
		},
	},
] as Array<Linter.Config>;
