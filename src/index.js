module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		"plugin:unicorn/recommended", // Enforces a set of opinionated but beneficial rules to catch common mistakes and improve code readability and maintainability.
		"plugin:prettier/recommended", // Ensures your codebase adheres to Prettier formatting rules, promoting consistency across your code.
		"prettier", // Ensures your codebase adheres to Prettier's formatting rules, promoting consistency across your code.
		"plugin:unicorn/recommended", // Enforces a set of opinionated but beneficial rules to catch common mistakes and improve code readability and maintainability.
		"plugin:sonarjs/recommended", // Applies rules to prevent bugs and suspicious code patterns, leveraging SonarJS's expertise in code quality.
		"plugin:perfectionist/recommended-alphabetical", // Adopts a perfectionist approach to code quality, with an emphasis on alphabetical ordering for declarations and imports.
	],
	plugins: [
		"check-file", // Enables linting rules that enforce file and directory naming conventions and structure.
		"unicorn", // Contains various JavaScript rules that encourage good coding practices and aim to prevent common mistakes.
		"sonarjs", // Focuses on detecting bugs and suspicious patterns in the code, inspired by SonarQube rules.
		"perfectionist", // Encourages a high degree of code quality and perfection, focusing on best practices and clean code (Note: This is not a standard ESLint plugin and may refer to a custom or hypothetical set of perfectionist rules).
		"import", // Provides linting rules related to ES6+ import/export syntax, helping manage module imports and ensuring they are correct and used
		"@stylistic", // Enforces stylistic conventions in code for readability and consistency (Note: This is not a standard ESLint plugin and may refer to a custom or hypothetical set of stylistic rules).
		"unused-imports", // Detects and removes unused imports, keeping the codebase clean and efficient.
		"prettier", // Ensures your codebase adheres to Prettier's formatting rules, promoting consistency across your code.
	],
	rules: {
		"@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: false }], // Enforce "one true brace style" for consistent brace positioning in control statements and functions, disallowing single-line blocks.
		"@stylistic/comma-spacing": "error", // Require a space after commas for improved readability in lists, object literals, etc.
		"@stylistic/function-call-spacing": "error", // Enforce no space between the function name and the parentheses when calling a function for consistency.
		"@stylistic/lines-between-class-members": "error", // Require an empty line between class members to improve class readability and organization.
		"@stylistic/object-curly-spacing": ["error", "always"], // Enforce spacing inside curly braces of objects for better readability.
		"@stylistic/padding-line-between-statements": [
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
		"@stylistic/space-before-blocks": "error", // Require a space before the opening brace of blocks to distinguish blocks from control statements or declarations more clearly.
		"@stylistic/spaced-comment": "error", // Enforce consistent spacing after the comment delimiters (// or /*) for readability.

		"check-file/filename-blocklist": [
			"error",
			{
				"**/*.enums.ts": "*.enum.ts",
				"**/*.models.ts": "*.model.ts",
				"**/*.tests.ts": "*.test.ts",
				"**/*.types.ts": "*.type.ts",
				"**/*.util.ts": "*.utility.ts",
			},
		], // Disallow specific filename patterns to enforce a consistent naming convention across the project. For example, preferring `*.enum.ts` over `*.enums.ts`.
		"check-file/filename-naming-convention": [
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
		"check-file/folder-match-with-fex": [
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
		"check-file/folder-naming-convention": [
			"error",
			{
				"src/**": "KEBAB_CASE",
			},
		], // Require all files and folders under the `src` directory to use flat case naming (e.g., `my_directory`), promoting consistency in file system organization.
		"import/newline-after-import": "error", // Enforce a newline after import statements to separate imports from the rest of the code logically, improving readability.
		"import/no-extraneous-dependencies": [
			"error",
			{
				devDependencies: ["**/*.test.{ts,js}", "**/*.spec.{ts,js}", "./test/**.{ts,js}", "./scripts/**/*.{ts,js}"],
			},
		], // Disallow the use of dependencies not listed in package.json to avoid runtime errors due to missing modules, with exceptions for files typically used in development like tests and scripts.
		"import/no-unresolved": "error", // Ensure all imports can be resolved to a module/file within the project or in `node_modules`, preventing broken imports that can lead to runtime errors.
		"import/order": [
			"error",
			{
				alphabetize: { caseInsensitive: false, order: "asc", orderImportKind: "asc" },
				groups: ["builtin", "external", "index", "parent", "sibling", "internal", "object", "type"],
				"newlines-between": "always-and-inside-groups",
				warnOnUnassignedImports: true,
			},
		], // Enforce a specific order and grouping of import statements to improve readability and maintainability, with additional rules for alphabetical sorting and spacing.
		"import/prefer-default-export": "error", // When a module exports a single name, prefer using default export over named export for simplicity and consistency in import statements.
		"perfectionist/sort-imports": "off", // Disable sorting of import statements to allow developers flexibility in organizing their code.
		"sonarjs/cognitive-complexity": ["error", 100], // Set a high threshold for cognitive complexity to allow complex but manageable functions.
		"sonarjs/no-duplicate-string": ["error", { threshold: 10 }], // Flag strings duplicated more than 10 times to encourage the use of constants for maintainability.
		"unicorn/filename-case": "off", // Disable filename casing rules to allow flexibility in project naming conventions.
		"unicorn/prefer-top-level-await": "off", // Allow flexibility in using top-level await, accommodating different project structures and initialization patterns.
		"unused-imports/no-unused-imports": "error", // Disallow unused imports to keep the codebase clean and efficient.
		"unused-imports/no-unused-vars": [
			"error",
			{
				args: "none", // Ignore unused function arguments to allow for interface consistency and potential future use.
				ignoreRestSiblings: true, // Allow unused variables when using rest properties for object destructuring, useful for omitting unwanted properties.
				vars: "all", // Check all variables for usage to maintain a clean and efficient codebase.
			},
		],
	},
};
