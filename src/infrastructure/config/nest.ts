import type { Linter } from "eslint";

// @ts-expect-error
import nestJsTyped from "@elsikora/eslint-plugin-nestjs-typed";
import { fixupPluginRules } from "@eslint/compat";
import ngModuleSort from "eslint-plugin-ng-module-sort";
import tseslint from "typescript-eslint";
import { formatConfig } from "../utility/format-config.utility";

export default [
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				// eslint-disable-next-line @elsikora-typescript/naming-convention
				projectService: true,
			},
		},
		plugins: {
			"@elsikora/nest/1": fixupPluginRules(ngModuleSort),

			// eslint-disable-next-line @elsikora-typescript/no-unsafe-argument
			"@elsikora/nest/2": formatConfig([nestJsTyped.plugin])[0],
		},
		rules: {
			"@elsikora/nest/1/decorator-array-items": [
				"error",
				{
					// eslint-disable-next-line @elsikora-typescript/naming-convention
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
