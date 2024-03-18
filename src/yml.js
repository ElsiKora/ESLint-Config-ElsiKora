module.exports = {
	overrides: [
		{
			env: {
				browser: true, // Enables browser global variables and scoping.
				es6: true, // Enables ES6+ global variables and scoping.
				node: true, // Enables Node.js global variables and scoping.
			},
			extends: [
				"plugin:yml/standard", // Enforces best practices and standard conventions for YAML files, ensuring consistency and maintainability.
			],
			files: ["*.yaml", "*.yml"], // Applies the yml plugin to YAML files only.
			parser: "yaml-eslint-parser", // Uses the YAML parser to lint YAML files, which supports comments and trailing commas.
		},
	],
};
