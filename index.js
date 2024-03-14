module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:unicorn/recommended",
		"plugin:prettier/recommended", // Ensures your codebase adheres to Prettier's formatting rules, promoting consistency across your code.
		"prettier",
	],
	plugins: ["unicorn"],
	rules: {
		"unicorn/filename-case": "off", // Disable filename casing rules to allow flexibility in project naming conventions.
		"unicorn/prefer-top-level-await": "off", // Allow flexibility in using top-level await, accommodating different project structures and initialization patterns.
	},
};
