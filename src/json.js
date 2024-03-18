export default {
	overrides: [
		{
			env: {
				browser: true, // Enables browser global variables and scoping.
				es6: true, // Enables ES6+ global variables and scoping.
				node: true, // Enables Node.js global variables and scoping.
			},
			extends: [
				"plugin:package-json/recommended", // Enforces best practices and conventions for package.json files, ensuring consistency and maintainability.
				"plugin:jsonc/all", // Enforces best practices and conventions for JSON files, ensuring consistency and maintainability.
				"plugin:jsonc/prettier", // Turns off all rules that are unnecessary or might conflict with Prettier.
				"plugin:perfectionist/recommended-alphabetical", // Adopts a perfectionist approach to code quality, with an emphasis on alphabetical ordering for declarations and imports.
			],
			files: ["*.json", "*.jsonc"], // Applies the package-json plugin to package.json files only.
			parser: "jsonc-eslint-parser", // Uses the JSONC parser to lint package.json files, which supports comments and trailing commas.
			plugins: [
				"package-json", // A plugin for enforcing best practices and standard conventions for package.json files, promoting consistency and maintainability.
				"perfectionist", // Encourages a high degree of code quality and perfection, focusing on best practices and clean code (Note: This is not a standard ESLint plugin and may refer to a custom or hypothetical set of perfectionist rules).
			],
			rules: {
				"jsonc/key-name-casing": "off",
				"package-json/order-properties": "off",
			},
		},
	],
};
