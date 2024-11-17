import type { Linter } from "eslint";

import tseslint from "typescript-eslint";

import { formatConfig } from "../utility/format";

export default tseslint.config({
	// @ts-ignore
	extends: [...formatConfig([...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked])],
	files: ["**/*.ts", "**/*.tsx"],
	languageOptions: {
		parser: tseslint.parser,
		parserOptions: {
			projectService: true,
			tsconfigRootDir: "./tsconfig.json",
		},
	},
	plugins: {
		"@elsikora-typescript": tseslint.plugin,
	},
	rules: {
		"@elsikora-typescript/adjacent-overload-signatures": "error", // Require function overloads to be consecutively placed, improving readability and organization of overloaded functions.
		"@elsikora-typescript/array-type": ["error", { default: "generic" }], // Enforce using generic array type syntax (Array<type>) for consistency and clarity in type definitions.
		"@elsikora-typescript/ban-ts-comment": "off", // Disable the rule that disallows `@ts-<directive>` comments to allow for flexibility in code comments.
		"@elsikora-typescript/ban-tslint-comment": "error", // Prohibit comments that disable TSLint rules, encouraging the use of ESLint for linting TypeScript.
		"@elsikora-typescript/ban-types": "off", // Disables the rule that prevents the use of certain built-in types like `Object`, `String`, `Number`, etc., allowing their use in the codebase.
		"@elsikora-typescript/consistent-generic-constructors": "error", // Enforces the use of a consistent generic constructor style, either `new () => T` or `new <T>() => T`, to ensure consistency and readability in type definitions.
		"@elsikora-typescript/consistent-indexed-object-style": "error", // Requires a consistent style for indexed objects, either using an interface or type alias for index signatures, to enhance code clarity and maintainability.
		"@elsikora-typescript/consistent-type-exports": "error", // Enforces consistent usage of type exports, promoting clarity and consistency in how types are exported from modules.
		"@elsikora-typescript/consistent-type-imports": "error", // Enforces using the `import type {}` syntax where possible for importing types, which can lead to more efficient bundling by avoiding unnecessary JavaScript execution.
		"@elsikora-typescript/explicit-function-return-type": "error", // Requires explicit return types on functions and class methods, improving code documentation and maintainability by making the intended return type clear.
		"@elsikora-typescript/explicit-module-boundary-types": "error", // Enforces explicit return and argument types on exported functions and classes at module boundaries, improving type safety and clarity in module interfaces.
		"@elsikora-typescript/interface-name-prefix": "off", // Disables the rule that requires interface names to be prefixed with "I", allowing more flexibility in naming interfaces according to project conventions.
		"@elsikora-typescript/naming-convention": [
			"error",
			{
				format: null, // Disables any format enforcement by default, allowing for flexibility unless specifically overridden.
				selector: "default",
			},
			{
				selector: ["variable", "parameter", "property", "parameterProperty", "accessor", "enumMember", "classProperty"],
				types: ["boolean"],
				format: null,
				prefix: ["is", "should", "has", "can", "did", "will", "use", "with"],
				filter: {
					regex: "^match$",
					match: false,
				},
			},
			{
				format: ["PascalCase", "UPPER_CASE"], // Boolean variables should be prefixed with specific keywords and can be in PascalCase or UPPER_CASE.
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
				format: ["UPPER_CASE"], // Readonly properties should use PascalCase.
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
			{
				selector: "variable", // Constants should be in UPPER_CASE and use camelCase for variables.
				modifiers: ["const"],
				format: ["UPPER_CASE"],
				filter: {
					regex: "^[A-Z][A-Z0-9_]*$",
					match: true,
				},
			},
			{
				selector: "class", // Abstract classes should use PascalCase and be prefixed with 'Abstract'.
				modifiers: ["abstract"],
				format: ["PascalCase"],
				prefix: ["Abstract"],
			},
			{
				selector: "class", // Classes should use PascalCase and be prefixed with 'Base'.
				format: ["PascalCase"],
				suffix: ["Factory"],
				filter: {
					regex: ".*Factory$",
					match: true,
				},
			},
			{
				selector: "class", // Classes should use PascalCase and be suffixed with 'Factory'.
				format: ["PascalCase"],
				suffix: ["Service"],
				filter: {
					regex: ".*Service$",
					match: true,
				},
			},
			{
				selector: "class", // Classes should use PascalCase and be suffixed with 'Service'.
				format: ["PascalCase"],
				suffix: ["Component"],
				filter: {
					regex: ".*Component$",
					match: true,
				},
			},
			{
				selector: "function", // Functions should use camelCase and be prefixed with 'use'.
				format: ["camelCase"],
				prefix: ["use"],
				filter: {
					regex: "^use[A-Z]",
					match: true,
				},
			},
			{
				selector: "typeParameter", // Type parameters should use PascalCase.
				format: ["PascalCase"],
				filter: {
					regex: "^[A-Z]$",
					match: true,
				},
			},
			{
				selector: "property", // Event properties should use PascalCase and be suffixed with 'Event'.
				format: ["PascalCase"],
				suffix: ["Event"],
				filter: {
					regex: ".*Event$",
					match: true,
				},
			},
		],
		"@elsikora-typescript/no-array-delete": "error", // Disallow using delete on arrays because it may lead to unexpected behavior by leaving a 'hole' in the array.
		"@elsikora-typescript/no-base-to-string": "error", // Require explicit toString() method calls on objects which may not safely convert to a string, preventing runtime errors.
		"@elsikora-typescript/no-duplicate-enum-values": "error", // Prevent duplicate values in enums, which can lead to confusing and hard-to-trace errors.
		"@elsikora-typescript/no-duplicate-type-constituents": "error", // Disallow duplicate type constituents in unions and intersections to maintain clean and understandable type definitions.
		"@elsikora-typescript/no-empty-function": "error", // Disallow empty functions to avoid unintentionally incomplete implementations.
		"@elsikora-typescript/no-empty-interface": "error", // Prevent the declaration of empty interfaces which can be misleading and unnecessary.
		"@elsikora-typescript/no-explicit-any": "off", // Allow the use of 'any' type to enable flexibility in cases where strict typing is excessively restrictive.
		"@elsikora-typescript/no-floating-promises": "error", // Require handling of promises to avoid uncaught promise rejections and unhandled async operations.
		"@elsikora-typescript/no-for-in-array": "error", // Disallow for-in loops over arrays because they iterate over object keys, not array elements.
		"@elsikora-typescript/no-implied-eval": "error", // Disallow methods that can execute code strings, preventing potential security vulnerabilities.
		"@elsikora-typescript/no-import-type-side-effects": "error", // Prohibit imports that can have side effects when only importing types, ensuring cleaner and safer code.
		"@elsikora-typescript/no-inferrable-types": "off", // Allow explicit types to be inferred by TypeScript for cleaner and more readable code.
		"@elsikora-typescript/no-loop-func": "error", // Forbid the creation of functions within loops to prevent errors due to the use of loop variables inside closures.
		"@elsikora-typescript/prefer-literal-enum-member": "off", // Allow the use of enum members as literals to enable more flexible and readable code.
		"@elsikora-typescript/no-magic-numbers": [
			"error",
			{
				detectObjects: true,
				ignore: [0, 1, -1],
				ignoreEnums: true,
			},
		], // Disallow magic numbers to make code more readable and maintainable, with exceptions for enums and object properties.
		"@elsikora-typescript/no-misused-promises": "error", // Ensure promises are used and awaited correctly, preventing logical errors in async operations.
		"@elsikora-typescript/no-mixed-enums": "error", // Prevent enums from being mixed in nonsensical ways, ensuring that they are used as intended.
		"@elsikora-typescript/no-redeclare": "error", // Disallow redeclaration of variables to prevent confusion and potential errors from shadowed variables.
		"@elsikora-typescript/no-redundant-type-constituents": "error", // Disallow redundant types in unions or intersections to keep type definitions clear and concise.
		"@elsikora-typescript/no-require-imports": "error", // Discourage the use of require imports in favor of ES6 import syntax for consistency and better module resolution.
		"@elsikora-typescript/no-restricted-imports": "error", // Allow specifying imports to avoid, helping to keep the dependency graph clean and manageable.
		"@elsikora-typescript/no-unnecessary-boolean-literal-compare": "error", // Avoid unnecessary comparisons in boolean expressions for cleaner code.
		"@elsikora-typescript/no-unnecessary-condition": ["off", { allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing: true }], // Allow potentially unnecessary conditions to run, acknowledging developer intent under non-strict null checks.
		"@elsikora-typescript/no-unused-vars": "error", // Enforce removal of variables that are declared but not used, keeping the codebase clean.
		"@elsikora-typescript/no-useless-empty-export": "error", // Disallow empty exports that serve no purpose and clutter the module namespace.
		"@elsikora-typescript/prefer-enum-initializers": "error", // Suggest using initializers for enums to make values explicit and clear.
		"@elsikora-typescript/prefer-for-of": "error", // Encourage the use of for-of loops for iterable objects for clarity and simplicity.
		"@elsikora-typescript/prefer-function-type": "error", // Prefer using function type literals over interfaces with call signatures for simplicity and readability.
		"@elsikora-typescript/prefer-includes": "error", // Suggest using includes method over indexOf for arrays and strings for better readability and intent.
		"@elsikora-typescript/prefer-namespace-keyword": "error", // Recommend the use of the namespace keyword over module to declare custom TypeScript modules.
		"@elsikora-typescript/prefer-optional-chain": "error", // Encourage optional chaining for cleaner and safer access to nested object properties.
		"@elsikora-typescript/prefer-readonly": "error", // Suggest marking properties that are never reassigned after initialization as readonly.
		"@elsikora-typescript/prefer-string-starts-ends-with": "error", // Recommend using startsWith and endsWith methods over equivalent string operations for clarity.
		"@elsikora-typescript/require-array-sort-compare": "error", // Require a compare function be provided to Array.sort() when sorting non-string values for predictable sorting.
		"@elsikora-typescript/restrict-plus-operands": "error", // Ensure that operands of the plus operator are of compatible types to prevent unexpected type coercion.
		"@elsikora-typescript/restrict-template-expressions": "error", // Restrict types allowed in template expressions to prevent runtime errors from unexpected type conversions.
		"@elsikora-typescript/return-await": "error", // Enforce returning await in async functions to ensure errors are caught in the try-catch block.
		"@elsikora-typescript/switch-exhaustiveness-check": "error", // Require exhaustive switch statements over union types, ensuring all possible cases are handled.
		"@elsikora-typescript/typedef": [
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
	},
}) as Array<Linter.Config>;
