export default {
	overrides: [
		{
			env: {
				browser: true, // Enables browser global variables and scoping.
				es6: true, // Enables ES6+ global variables and scoping.
				node: true, // Enables Node.js global variables and scoping.
			},
			extends: [
				"plugin:react/recommended", // Enforces best practices and standard conventions for React projects, ensuring consistency and maintainability.
			],
			files: ["*.jsx"], // Applies the yml plugin to YAML files only.
			parserOptions: {
				ecmaFeatures: {
					jsx: true, // Enables JSX parsing for React components.
				},
			},
		},
	],
};
