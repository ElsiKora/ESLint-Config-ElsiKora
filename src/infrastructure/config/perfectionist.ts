import type { Linter } from "eslint";

import perfectionist from "eslint-plugin-perfectionist";

import { formatConfig } from "../utility/format-config.utility";
import { formatRuleName } from "../utility/format-rule-name.utility";

export default [
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
