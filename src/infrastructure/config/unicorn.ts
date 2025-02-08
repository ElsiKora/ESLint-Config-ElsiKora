import type { Linter } from "eslint";

import unicorn from "eslint-plugin-unicorn";

import { formatConfig } from "../utility/format-config.utility";

export default [
	...formatConfig([unicorn.configs["flat/recommended"]]),
	{
		rules: {
			"unicorn/filename-case": "off", // Disable filename casing rules to allow flexibility in project naming conventions.
			"unicorn/prefer-top-level-await": "off", // Allow flexibility in using top-level await, accommodating different project structures and initialization patterns.
		},
	},
] as Array<Linter.Config>;
