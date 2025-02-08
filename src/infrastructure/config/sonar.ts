import type { Linter } from "eslint";

import sonarjs from "eslint-plugin-sonarjs";

import { formatConfig, formatRuleName } from "../utility/format";

const congnitiveComplexity: number = 100;
const duplicateStringThreshold: number = 10;

export default [
	// eslint-disable-next-line @elsikora-typescript/no-unsafe-argument
	...formatConfig([sonarjs.configs.recommended]),
	{
		rules: {
			[formatRuleName("@typescript-eslint/no-unused-vars")]: "off",
			[formatRuleName("sonarjs/bool-param-default")]: "error", // Require default values for boolean parameters to improve readability.
			[formatRuleName("sonarjs/cognitive-complexity")]: ["error", congnitiveComplexity], // Set a high threshold for cognitive complexity to allow complex but manageable functions.
			[formatRuleName("sonarjs/no-duplicate-string")]: ["error", { threshold: duplicateStringThreshold }], // Flag strings duplicated more than 10 times to encourage the use of constants for maintainability.
			"no-unused-vars": "off",
		},
	},
] as Array<Linter.Config>;
