import type { Linter } from "eslint";

import js from "@eslint/js";

export default [
	js.configs.recommended,
	{
		rules: {
			"no-await-in-loop": "error",
			"no-compare-neg-zero": "error",
			"no-constructor-return": "error",
			"no-duplicate-imports": "error",
			"no-inner-declarations": "error",
			"no-promise-executor-return": "error",
			"no-self-compare": "error",
		},
	},
] as Array<Linter.Config>;
