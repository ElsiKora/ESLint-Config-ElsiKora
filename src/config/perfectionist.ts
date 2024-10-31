import type { Linter } from "eslint";

import eslintPluginPackageJson from "eslint-plugin-package-json/configs/recommended";
import perfectionist from "eslint-plugin-perfectionist";

import { formatConfig, formatRuleName } from "../utility/format";

export default [
	// @ts-expect-error
	...formatConfig([perfectionist.configs["recommended-alphabetical"]]),
	{
		rules: {
			[formatRuleName("perfectionist/sort-imports")]: [
				"error",
				{
					customGroups: {
						type: {},
						value: {},
					},
					environment: "node",
					groups: ["builtin-type", "type", "external-type", "internal-type", "parent-type", "sibling-type", "index-type", "builtin", "external", "internal", "parent", "sibling", "index", "object", "style", "side-effect", "unknown"],
					ignoreCase: false,
					internalPattern: ["~/**"],
					matcher: "minimatch",
					newlinesBetween: "always",
					order: "asc",
					sortSideEffects: true,
					specialCharacters: "keep",
					type: "alphabetical",
				},
			],
		},
	},
] as Array<Linter.Config>;
