export default {
	overrides: [
		{
			env: {
				es6: true, // Enables ES6+ global variables and scoping.
				node: true, // Enables Node.js global variables and scoping.
			},
			extends: [
				"plugin:@elsikora/nestjs-typed/recommended", // Incorporates best practices and standard conventions for NestJS projects, tailored for strong typing and clean architecture.
			],
			files: ["*.ts", "*.js"], // Applies for TypeScript and JavaScript files.
			overrides: [
				{
					files: ["*.ts"], // Applies the TypeScript parser and plugin to TypeScript files only.
					parser: "@typescript-eslint/parser", // Uses the TypeScript parser to lint TypeScript files, which supports type checking and ES6+ features.
				},
			],
			plugins: [
				"ng-module-sort", // A plugin for sorting NestJS modules, ensuring a consistent ordering of module imports and declarations.
				"@elsikora/nestjs-typed", // A plugin for enforcing strong typing and best practices in NestJS projects, promoting clean architecture and maintainability.
			],
			rules: {
				"@elsikora/nestjs-typed/crud-methods-before-other": "off", // Disable the rule that CRUD methods must be listed before other methods in NestJS services for flexibility in method organization.
				"@elsikora/nestjs-typed/crud-methods-order": "off", // Allow any order of CRUD methods in NestJS services, giving developers freedom in how they structure their service classes.
				"@elsikora/nestjs-typed/provided-injected-should-match-factory-parameters": "off", // Disable the rule that the provided and injected parameters should match in NestJS factories for flexibility in complex dependency injection scenarios.
				"ng-module-sort/decorator-array-items": [
					"error",
					{
						reverseSort: false,
					},
				], // Ensure items in NestJS module decorator arrays (e.g., declarations, imports) are sorted alphabetically for improved readability and easier maintenance.
			},
		},
	],
};
