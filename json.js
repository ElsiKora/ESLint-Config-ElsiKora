module.exports = {
	overrides: [
		{
			env: {
				browser: true, // Enables browser global variables and scoping.
				es6: true, // Enables ES6+ global variables and scoping.
				node: true, // Enables Node.js global variables and scoping.
			},
			extends: [
				"plugin:package-json/recommended", // Enforces best practices and conventions for package.json files, ensuring consistency and maintainability.
				"plugin:jsonc/recommended-with-jsonc", // Enforces best practices and conventions for JSON files, ensuring consistency and maintainability.
				"plugin:jsonc/prettier", // Turns off all rules that are unnecessary or might conflict with Prettier.
			],
			files: ["*.json", "*.jsonc"], // Applies the package-json plugin to package.json files only.
			parser: "jsonc-eslint-parser", // Uses the JSONC parser to lint package.json files, which supports comments and trailing commas.
			plugins: [
				"package-json", // A plugin for enforcing best practices and standard conventions for package.json files, promoting consistency and maintainability.
			],
		},
	],
};
