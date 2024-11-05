import type { IFeatureConfig } from "./types";

export const FEATURES_CONFIG: Record<string, IFeatureConfig> = {
	javascript: {
		packages: [],
		required: true,
		description: "JavaScript support",
	},
	typescript: {
		packages: ["typescript", "@typescript-eslint/parser", "@typescript-eslint/eslint-plugin"],
		detect: ["typescript", "@types/node"],
		description: "TypeScript support",
		requiresTypescript: true,
	},
	react: {
		packages: ["eslint-plugin-react", "eslint-plugin-react-hooks"],
		detect: ["react", "react-dom", "@types/react"],
		description: "React framework support",
	},
	nest: {
		packages: ["@nestjs/eslint-plugin", "eslint-plugin-nestjs-typed"],
		detect: ["@nestjs/core", "@nestjs/common"],
		description: "NestJS framework support",
		requiresTypescript: true,
	},
	tailwindCss: {
		packages: ["eslint-plugin-tailwindcss"],
		detect: ["tailwindcss"],
		description: "Tailwind CSS support",
	},
	prettier: {
		packages: ["eslint-config-prettier", "eslint-plugin-prettier", "prettier"],
		detect: ["prettier"],
		description: "Prettier integration",
	},
	stylistic: {
		packages: ["@stylistic/eslint-plugin"],
		description: "Stylistic rules",
	},
	sonar: {
		packages: ["eslint-plugin-sonarjs"],
		description: "SonarJS code quality rules",
	},
	unicorn: {
		packages: ["eslint-plugin-unicorn"],
		description: "Unicorn rules",
	},
	perfectionist: {
		packages: ["eslint-plugin-perfectionist"],
		description: "Code organization rules",
	},
	json: {
		packages: ["eslint-plugin-jsonc"],
		description: "JSON files support",
	},
	yaml: {
		packages: ["eslint-plugin-yml"],
		description: "YAML files support",
	},
	checkFile: {
		packages: ["eslint-plugin-check-file"],
		description: "File naming rules",
	},
	packageJson: {
		packages: ["eslint-plugin-package-json"],
		description: "package.json linting",
	},
	node: {
		packages: ["eslint-plugin-n"],
		detect: ["node", "@types/node"],
		description: "Node.js specific rules",
	},
	regexp: {
		packages: ["eslint-plugin-regexp"],
		description: "RegExp linting",
	},
	typeorm: {
		packages: ["eslint-plugin-typeorm"],
		detect: ["typeorm", "@typeorm/core"],
		description: "TypeORM support",
		requiresTypescript: true,
	},
} as const;

export const FEATURE_GROUPS: Record<string, Array<string>> = {
	"Core Features": ["javascript", "typescript"],
	Frameworks: ["react", "nest"],
	Styling: ["tailwindCss", "prettier", "stylistic"],
	"Code Quality": ["sonar", "unicorn", "perfectionist"],
	"File Types": ["json", "yaml", "checkFile", "packageJson"],
	"Other Tools": ["node", "regexp", "typeorm"],
} as const;

export const ESLINT_CONFIG_FILES: Array<string> = ["eslint.config.js", "eslint.config.cjs", "eslint.config.mjs", ".eslintrc.js", ".eslintrc.cjs", ".eslintrc.yaml", ".eslintrc.yml", ".eslintrc.json", ".eslintrc", ".eslintignore"];

export const PRETTIER_CONFIG_FILES: Array<string> = ["prettier.config.js", "prettier.config.cjs", "prettier.config.mjs", ".prettierrc", ".prettierrc.js", ".prettierrc.cjs", ".prettierrc.json", ".prettierrc.yaml", ".prettierrc.yml", ".prettierignore"];

export const STYLELINT_CONFIG_FILES: Array<string> = ["stylelint.config.js", "stylelint.config.cjs", "stylelint.config.mjs", ".stylelintrc", ".stylelintrc.js", ".stylelintrc.cjs", ".stylelintrc.json", ".stylelintrc.yaml", ".stylelintrc.yml", ".stylelintignore"];

export const CORE_DEPENDENCIES: Array<string> = ["@elsikora/eslint-config", "@eslint/js", "@eslint/compat", "@types/eslint__js"];
