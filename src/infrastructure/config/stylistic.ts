import type { Linter } from "eslint";

import stylistic from "@stylistic/eslint-plugin";

import { formatConfig, formatRuleName } from "../utility/format";

export default [
	{
		...formatConfig([stylistic.configs["recommended-flat"]])[0],
		plugins: {
			"@elsikora-stylistic": stylistic,
		},
		rules: {
			[formatRuleName("@stylistic/brace-style")]: ["error", "1tbs", { allowSingleLine: false }], // Enforce "one true brace style" for consistent brace positioning in control statements and functions, disallowing single-line blocks.
			[formatRuleName("@stylistic/comma-spacing")]: "error", // Require a space after commas for improved readability in lists, object literals, etc.
			[formatRuleName("@stylistic/function-call-spacing")]: "error", // Enforce no space between the function name and the parentheses when calling a function for consistency.
			[formatRuleName("@stylistic/lines-between-class-members")]: "error", // Require an empty line between class members to improve class readability and organization.
			[formatRuleName("@stylistic/object-curly-spacing")]: ["error", "always"], // Enforce spacing inside curly braces of objects for better readability.
			[formatRuleName("@stylistic/padding-line-between-statements")]: [
				"error",
				{ blankLine: "always", next: "switch", prev: "*" },
				{ blankLine: "always", next: "function", prev: "*" },
				{ blankLine: "always", next: "return", prev: "*" },
				{ blankLine: "always", next: "multiline-const", prev: "*" },
				{ blankLine: "always", next: "multiline-let", prev: "*" },
				{ blankLine: "always", next: "block", prev: "*" },
				{ blankLine: "always", next: "block-like", prev: "*" },
				{ blankLine: "always", next: "class", prev: "*" },
				{ blankLine: "always", next: "try", prev: "*" },
				{ blankLine: "always", next: "throw", prev: "*" },
				{ blankLine: "always", next: "if", prev: "*" },
				{ blankLine: "always", next: "for", prev: "*" },
				{ blankLine: "always", next: "default", prev: "*" },
				{ blankLine: "always", next: "case", prev: "*" },
				{ blankLine: "always", next: "break", prev: "*" },
			], // Each specifies required blank lines around certain statements to ensure consistent vertical spacing and sectioning of code for readability.
			[formatRuleName("@stylistic/space-before-blocks")]: "error", // Require a space before the opening brace of blocks to distinguish blocks from control statements or declarations more clearly.
			[formatRuleName("@stylistic/spaced-comment")]: "error", // Enforce consistent spacing after the comment delimiters (// or /*) for readability.
		},
	},
] as Array<Linter.Config>;
