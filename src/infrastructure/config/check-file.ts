import type { ESLint, Linter } from "eslint";

// @ts-expect-error
import checkFile from "eslint-plugin-check-file";

import { formatRuleName } from "../utility/format";

export default [
	{
		files: ["src/**/*"],
		plugins: {
			"@elsikora-check-file": checkFile as ESLint.Plugin,
		},
		rules: {
			[formatRuleName("check-file/filename-blocklist")]: [
				"error",
				{
					"**/*.enums.ts": "*.enum.ts",
					"**/*.models.ts": "*.model.ts",
					"**/*.tests.ts": "*.test.ts",
					"**/*.types.ts": "*.type.ts",
					"**/*.util.ts": "*.utility.ts",
				},
			], // Disallow specific filename patterns to enforce a consistent naming convention across the project. For example, preferring `*.enum.ts` over `*.enums.ts`.
			[formatRuleName("check-file/filename-naming-convention")]: [
				"error",
				{
					"**/class/**/*.{js,ts}": "KEBAB_CASE",
					"**/dto/**/*.{js,ts}": "KEBAB_CASE",
					"**/entity/**/*.{js,ts}": "KEBAB_CASE",
					"**/enum/**/*.{js,ts}": "KEBAB_CASE",
					"**/event/*/*.{js,ts}": "KEBAB_CASE",
					"**/filter/**/*.{js,ts}": "KEBAB_CASE",
					"**/interceptor/**/*.{js,ts}": "KEBAB_CASE",
					"**/interface/**/*.{js,ts}": "KEBAB_CASE",
					"**/middleware/**/*.{js,ts}": "KEBAB_CASE",
					"**/modules/*/*.{js,ts}": "KEBAB_CASE",
					"**/subscriber/**/*.{js,ts}": "KEBAB_CASE",
					"**/type/*/*.{js,ts}": "KEBAB_CASE",
					"**/utility/**/*.{js,ts}": "KEBAB_CASE",
					"**/validator/**/*.{js,ts}": "KEBAB_CASE",
				},
				{ ignoreMiddleExtensions: true },
			], // Enforce a specific naming convention for files in various directories, typically using KEBAB_CASE for clarity and consistency. The `ignoreMiddleExtensions` option allows ignoring file extensions in the middle of filenames, focusing on the final extension for the rule.
			[formatRuleName("check-file/folder-match-with-fex")]: [
				"error",
				{
					"*.api.{ts,js}": "**/api/**",
					"*.class.{js,jsx,ts,tsx}": "**/class/**",
					"*.dto.{js,jsx,ts,tsx}": "**/dto/**",
					"*.entity.{js,jsx,ts,tsx}": "**/entity/**",
					"*.enum.{js,jsx,ts,tsx}": "**/enum/**",
					"*.event.{js,jsx,ts,tsx}": "**/event/**",
					"*.filter.{js,jsx,ts,tsx}": "**/filter/**",
					"*.interceptor.{js,jsx,ts,tsx}": "**/interceptor/**",
					"*.interface.{js,jsx,ts,tsx}": "**/interface/**",
					"*.middleware.{js,jsx,ts,tsx}": "**/middleware/**",
					"*.subscriber.{js,jsx,ts,tsx}": "**/subscriber/**",
					"*.type.{js,jsx,ts,tsx}": "**/type/**",
					"*.utility.{js,jsx,ts,tsx}": "**/utility/**",
					"*.validator.{js,jsx,ts,tsx}": "**/validator/**",
				},
			], // Enforce a naming convention that requires files to be located in folders matching their type (e.g., API files in /api, DTOs in /dto) to ensure a clear and consistent project structure.
			[formatRuleName("check-file/folder-naming-convention")]: [
				"error",
				{
					"src/**": "KEBAB_CASE",
				},
			], // Require all files and folders under the `src` directory to use flat case naming (e.g., `my_directory`), promoting consistency in file system organization.
		},
	},
] as Array<Linter.Config>;
