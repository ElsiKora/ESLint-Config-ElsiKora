import type { Linter } from "eslint";

import react from "@eslint-react/eslint-plugin";
import tseslint from "typescript-eslint";

import { formatConfig } from "../utility/format";

export default [
	...formatConfig([react.configs.all]),
	{
		files: ["**/*.{js,jsx}"],
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
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
				projectService: true,
				tsconfigRootDir: "./tsconfig.json",
			},
		},
	},
] as Array<Linter.Config>;
