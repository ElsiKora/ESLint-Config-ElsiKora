import type { Linter } from "eslint";

import react from "@eslint-react/eslint-plugin";
import tseslint from "typescript-eslint";

import { formatConfig } from "../utility/format-config.utility";

export default [
	// @ts-ignore
	...formatConfig([react.configs.all]),
	{
		files: ["**/*.{js,jsx}"],
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					// eslint-disable-next-line @elsikora-typescript/naming-convention
					jsx: true,
				},
				ecmaVersion: "latest",
			},
		},
		plugins: {
			react: react,
		},
	},
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				// eslint-disable-next-line @elsikora-typescript/naming-convention
				projectService: true,
			},
		},
	},
] as Array<Linter.Config>;
