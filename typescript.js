module.exports = {
	overrides: [
		{
			env: {
				es6: true,
				node: true,
			},
			extends: [
				"plugin:@typescript-eslint/recommended", // Enables a core set of rules recommended for TypeScript, promoting type safety and developer productivity.
				"plugin:@typescript-eslint/recommended-requiring-type-checking", // Extends TypeScript linting with rules that require type information, further enhancing type safety and code quality.
				"plugin:@elsikora/eslint-plugin-sort-decorators/strict", // Enforces strict ordering of decorators, ensuring consistency and readability in decorator usage.
			],
			files: ["*.ts", "*.tsx"], // Applies the TypeScript configuration to TypeScript files only.
			parser: "@typescript-eslint/parser", // Specifies the ESLint parser for TypeScript files, ensuring that TypeScript syntax is parsed correctly.
			parserOptions: {
				ecmaVersion: "latest",
				project: "tsconfig.json",
				sourceType: "module",
				tsconfigRootDir: __dirname,
			},
			plugins: [
				"@typescript-eslint", // Provides linting rules for TypeScript, including type-specific checks and TypeScript syntax.
				"typeorm-typescript", // Provides linting rules for TypeORM usage with TypeScript, ensuring proper usage of the ORM.
				"@elsikora/sort-decorators", // Offers rules for sorting decorators in a consistent manner, enhancing readability and organization of decorator usage.
			],
			rules: {
				"@typescript-eslint/adjacent-overload-signatures": "error", // Require function overloads to be consecutively placed, improving readability and organization of overloaded functions.
				"@typescript-eslint/array-type": ["error", { default: "generic" }], // Enforce using generic array type syntax (Array<type>) for consistency and clarity in type definitions.
				"@typescript-eslint/ban-ts-comment": "error", // Disallow `@ts-ignore`, `@ts-nocheck`, and `@ts-check` comments to avoid bypassing TypeScript's static type checking.
				"@typescript-eslint/ban-tslint-comment": "error", // Prohibit comments that disable TSLint rules, encouraging the use of ESLint for linting TypeScript.
				"@typescript-eslint/ban-types": "off", // Disables the rule that prevents the use of certain built-in types like `Object`, `String`, `Number`, etc., allowing their use in the codebase.
				"@typescript-eslint/consistent-generic-constructors": "error", // Enforces the use of a consistent generic constructor style, either `new () => T` or `new <T>() => T`, to ensure consistency and readability in type definitions.
				"@typescript-eslint/consistent-indexed-object-style": "error", // Requires a consistent style for indexed objects, either using an interface or type alias for index signatures, to enhance code clarity and maintainability.
				"@typescript-eslint/consistent-type-exports": "error", // Enforces consistent usage of type exports, promoting clarity and consistency in how types are exported from modules.
				"@typescript-eslint/consistent-type-imports": "error", // Enforces using the `import type {}` syntax where possible for importing types, which can lead to more efficient bundling by avoiding unnecessary JavaScript execution.
				"@typescript-eslint/explicit-function-return-type": "error", // Requires explicit return types on functions and class methods, improving code documentation and maintainability by making the intended return type clear.
				"@typescript-eslint/explicit-module-boundary-types": "error", // Enforces explicit return and argument types on exported functions and classes at module boundaries, improving type safety and clarity in module interfaces.
				"@typescript-eslint/interface-name-prefix": "off", // Disables the rule that requires interface names to be prefixed with "I", allowing more flexibility in naming interfaces according to project conventions.
				"@typescript-eslint/naming-convention": [
					"error",
					{
						format: null, // Disables any format enforcement by default, allowing for flexibility unless specifically overridden.
						selector: "default",
					},
					{
						format: ["PascalCase", "UPPER_CASE"], // Boolean variables should be prefixed with specific keywords and can be in PascalCase or UPPER_CASE.
						prefix: ["is", "should", "has", "can", "did", "will"],
						selector: "variable",
						types: ["boolean"],
					},
					{
						format: ["camelCase", "UPPER_CASE", "PascalCase"], // Variables and variable-like identifiers should use camelCase, UPPER_CASE, or PascalCase, providing flexibility for naming.
						selector: "variableLike",
					},
					{
						format: ["camelCase"], // Function parameters should always use camelCase.
						selector: "parameter",
					},
					{
						format: ["camelCase"], // Class constructor parameters that are also class properties should use camelCase.
						selector: "parameterProperty",
					},
					{
						format: ["camelCase"], // Private class members should use camelCase and not have a leading underscore.
						leadingUnderscore: "forbid",
						modifiers: ["private"],
						selector: "memberLike",
					},
					{
						format: ["PascalCase"], // Types, interfaces, classes, etc., should use PascalCase.
						selector: "typeLike",
					},
					{
						format: ["PascalCase"], // Readonly properties should use PascalCase.
						modifiers: ["readonly"],
						selector: "property",
					},
					{
						format: ["UPPER_CASE"], // Enum members should be in UPPER_CASE.
						selector: "enumMember",
					},
					{
						format: ["PascalCase"], // Enums should use PascalCase and be prefixed with 'E'.
						prefix: ["E"],
						selector: "enum",
					},
					{
						format: ["StrictPascalCase"], // Interfaces should use StrictPascalCase and be prefixed with 'I'.
						prefix: ["I"],
						selector: "interface",
					},
					{
						format: ["StrictPascalCase"], // Type aliases should use StrictPascalCase and be prefixed with 'T'.
						prefix: ["T"],
						selector: "typeAlias",
					},
				],
				"@typescript-eslint/no-array-delete": "error", // Disallow using delete on arrays because it may lead to unexpected behavior by leaving a 'hole' in the array.
				"@typescript-eslint/no-base-to-string": "error", // Require explicit toString() method calls on objects which may not safely convert to a string, preventing runtime errors.
				"@typescript-eslint/no-duplicate-enum-values": "error", // Prevent duplicate values in enums, which can lead to confusing and hard-to-trace errors.
				"@typescript-eslint/no-duplicate-type-constituents": "error", // Disallow duplicate type constituents in unions and intersections to maintain clean and understandable type definitions.
				"@typescript-eslint/no-empty-function": "error", // Disallow empty functions to avoid unintentionally incomplete implementations.
				"@typescript-eslint/no-empty-interface": "error", // Prevent the declaration of empty interfaces which can be misleading and unnecessary.
				"@typescript-eslint/no-explicit-any": "off", // Allow the use of 'any' type to enable flexibility in cases where strict typing is excessively restrictive.
				"@typescript-eslint/no-floating-promises": "error", // Require handling of promises to avoid uncaught promise rejections and unhandled async operations.
				"@typescript-eslint/no-for-in-array": "error", // Disallow for-in loops over arrays because they iterate over object keys, not array elements.
				"@typescript-eslint/no-implied-eval": "error", // Disallow methods that can execute code strings, preventing potential security vulnerabilities.
				"@typescript-eslint/no-import-type-side-effects": "error", // Prohibit imports that can have side effects when only importing types, ensuring cleaner and safer code.
				"@typescript-eslint/no-loop-func": "error", // Forbid the creation of functions within loops to prevent errors due to the use of loop variables inside closures.
				"@typescript-eslint/no-loss-of-precision": "error", // Prevent literal numbers that lose precision when converted to JavaScript Number type.
				"@typescript-eslint/no-magic-numbers": ["error", { detectObjects: true, ignoreEnums: true }], // Disallow magic numbers to make code more readable and maintainable, with exceptions for enums and object properties.
				"@typescript-eslint/no-misused-promises": "error", // Ensure promises are used and awaited correctly, preventing logical errors in async operations.
				"@typescript-eslint/no-mixed-enums": "error", // Prevent enums from being mixed in nonsensical ways, ensuring that they are used as intended.
				"@typescript-eslint/no-redeclare": "error", // Disallow redeclaration of variables to prevent confusion and potential errors from shadowed variables.
				"@typescript-eslint/no-redundant-type-constituents": "error", // Disallow redundant types in unions or intersections to keep type definitions clear and concise.
				"@typescript-eslint/no-require-imports": "error", // Discourage the use of require imports in favor of ES6 import syntax for consistency and better module resolution.
				"@typescript-eslint/no-restricted-imports": "error", // Allow specifying imports to avoid, helping to keep the dependency graph clean and manageable.
				"@typescript-eslint/no-throw-literal": "error", // Enforce throwing Error objects instead of literals to ensure proper error handling.
				"@typescript-eslint/no-unnecessary-boolean-literal-compare": "error", // Avoid unnecessary comparisons in boolean expressions for cleaner code.
				"@typescript-eslint/no-unnecessary-condition": ["off", { allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: true }], // Allow potentially unnecessary conditions to run, acknowledging developer intent under non-strict null checks.
				"@typescript-eslint/no-unused-vars": "error", // Enforce removal of variables that are declared but not used, keeping the codebase clean.
				"@typescript-eslint/no-useless-empty-export": "error", // Disallow empty exports that serve no purpose and clutter the module namespace.
				"@typescript-eslint/no-useless-template-literals": "error", // Prevent template literals with no expressions, where simple strings could be used instead.
				"@typescript-eslint/no-var-requires": "error", // Encourage the use of import statements over require for module importing for consistency and clarity.
				"@typescript-eslint/prefer-enum-initializers": "error", // Suggest using initializers for enums to make values explicit and clear.
				"@typescript-eslint/prefer-for-of": "error", // Encourage the use of for-of loops for iterable objects for clarity and simplicity.
				"@typescript-eslint/prefer-function-type": "error", // Prefer using function type literals over interfaces with call signatures for simplicity and readability.
				"@typescript-eslint/prefer-includes": "error", // Suggest using includes method over indexOf for arrays and strings for better readability and intent.
				"@typescript-eslint/prefer-namespace-keyword": "error", // Recommend the use of the namespace keyword over module to declare custom TypeScript modules.
				"@typescript-eslint/prefer-optional-chain": "error", // Encourage optional chaining for cleaner and safer access to nested object properties.
				"@typescript-eslint/prefer-readonly": "error", // Suggest marking properties that are never reassigned after initialization as readonly.
				"@typescript-eslint/prefer-string-starts-ends-with": "error", // Recommend using startsWith and endsWith methods over equivalent string operations for clarity.
				"@typescript-eslint/require-array-sort-compare": "error", // Require a compare function be provided to Array.sort() when sorting non-string values for predictable sorting.
				"@typescript-eslint/restrict-plus-operands": "error", // Ensure that operands of the plus operator are of compatible types to prevent unexpected type coercion.
				"@typescript-eslint/restrict-template-expressions": "error", // Restrict types allowed in template expressions to prevent runtime errors from unexpected type conversions.
				"@typescript-eslint/return-await": "error", // Enforce returning await in async functions to ensure errors are caught in the try-catch block.
				"@typescript-eslint/sort-type-constituents": "off", // Allow type constituents to be in any order, offering flexibility in type definitions.
				"@typescript-eslint/switch-exhaustiveness-check": "error", // Require exhaustive switch statements over union types, ensuring all possible cases are handled.
				"@typescript-eslint/typedef": [
					"error",
					{
						arrayDestructuring: true,
						arrowParameter: true,
						memberVariableDeclaration: true,
						objectDestructuring: true,
						parameter: true,
						propertyDeclaration: true,
						variableDeclaration: true,
						variableDeclarationIgnoreFunction: true,
					},
				], // Enforce type definitions in various situations to ensure code clarity and maintainability. This includes variables, function parameters, and class members among others, with an exception for functions in variable declarations.
				"typeorm-typescript/enforce-column-types": "error", // Enforce explicit column types in TypeORM to ensure database consistency and readability.
				"typeorm-typescript/enforce-relation-types": "error", // Enforce explicit relation types in TypeORM for clear ORM mapping and database integrity.
			},
			settings: {
				"import/parsers": {
					"@typescript-eslint/parser": [".ts", ".tsx"], // Specifies the parser for TypeScript files when using ESLint's import plugin.
				},
				"import/resolver": {
					typescript: {
						alwaysTryTypes: true, // Ensures that ESLint always resolves types from TypeScript files, promoting consistency in type resolution.
						project: "./tsconfig.json", // Specifies the path to the TypeScript configuration file for the project, allowing ESLint to resolve TypeScript modules and types.
					},
				},
			},
		},
	],
};
