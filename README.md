<p align="center">
  <img src="https://6jft62zmy9nx2oea.public.blob.vercel-storage.com/eslintconfig-bXk1q9MhiaTOgJbp6VOt82kSdJYuYG.png" width="500" alt="project-logo">
</p>

<h1 align="center">ESLint Config ⚡</h1>
<p align="center"><em>Modern, opinionated ESLint configuration for TypeScript and JavaScript projects</em></p>

<p align="center">
    <a aria-label="ElsiKora logo" href="https://elsikora.com">
  <img src="https://img.shields.io/badge/MADE%20BY%20ElsiKora-333333.svg?style=for-the-badge" alt="ElsiKora">
</a> <img src="https://img.shields.io/badge/version-blue.svg?style=for-the-badge&logo=npm&logoColor=white" alt="version"> <img src="https://img.shields.io/badge/typescript-blue.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript"> <img src="https://img.shields.io/badge/eslint-purple.svg?style=for-the-badge&logo=eslint&logoColor=white" alt="eslint"> <img src="https://img.shields.io/badge/prettier-ff69b4.svg?style=for-the-badge&logo=prettier&logoColor=white" alt="prettier"> <img src="https://img.shields.io/badge/node-green.svg?style=for-the-badge&logo=node.js&logoColor=white" alt="node"> <img src="https://img.shields.io/badge/license-green.svg?style=for-the-badge&logo=license&logoColor=white" alt="license">
</p>

## 📚 Table of Contents

- [Description](#-description)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)
- [License](#-license)

## 📖 Description

A comprehensive ESLint configuration suite designed for modern TypeScript and JavaScript development. This package
provides a carefully curated set of ESLint rules and configurations that enforce consistent code style, catch potential
errors, and promote best practices across your entire codebase. Supporting multiple frameworks including NestJS, React,
Angular, and more, it offers seamless integration with popular tools like Prettier, TypeScript, and various CI/CD
workflows. Perfect for teams looking to maintain high code quality standards with minimal setup overhead.

## 🚀 Features

- ✨ **Interactive CLI setup wizard for easy configuration**
- ✨ **Comprehensive TypeScript support with strict type checking**
- ✨ **Framework-specific configurations for React, NestJS, Angular, and more**
- ✨ **Integrated Prettier formatting support**
- ✨ **Automated IDE configuration for VSCode and WebStorm**
- ✨ **Built-in GitHub CI/CD workflow templates**
- ✨ **Advanced code organization rules with eslint-plugin-perfectionist**
- ✨ **Customizable file naming conventions and structure validation**
- ✨ **Sonar and Unicorn rules for enhanced code quality**
- ✨ **Automatic package.json sorting and validation**
- ✨ **YAML and JSON linting support**
- ✨ **Integrated Stylelint configuration for CSS/SCSS**
- ✨ **Changesets integration for version management**

## 🛠 Installation

```bash
# Using npm
npm install -D @elsikora/eslint-config

# Using yarn
yarn add -D @elsikora/eslint-config

# Using pnpm
pnpm add -D @elsikora/eslint-config
```

## 💡 Usage

## Quick Start

```bash
# Run the interactive setup wizard
npx @elsikora/eslint-config@latest
```

## Manual Configuration

Create `eslint.config.js` in your project root:

```javascript
import createConfig from "@elsikora/eslint-config";

export default [
	{
		ignores: ["**/node_modules/", "**/dist/", "**/build/"],
	},
	...createConfig({
		withTypescript: true,
		withPrettier: true,
		withStylistic: true,
		withSonar: true,
		withUnicorn: true,
	}),
];
```

## TypeScript Configuration

For TypeScript projects, enable type-aware rules:

```javascript
import createConfig from "@elsikora/eslint-config";

export default [
	...createConfig({
		withTypescript: true,
		withTypeorm: true,
		withNest: true,
	}),
];
```

## React Configuration

For React projects:

```javascript
import createConfig from "@elsikora/eslint-config";

export default [
	...createConfig({
		withJavascript: true,
		withTypescript: true,
		withReact: true,
		withTailwindCss: true,
	}),
];
```

## Using with Prettier

Enable Prettier integration:

```javascript
import createConfig from "@elsikora/eslint-config";

export default [
	...createConfig({
		withPrettier: true,
		withStylistic: true,
	}),
];
```

Then create `prettier.config.js`:

```javascript
export default {
	useTabs: true,
	tabWidth: 2,
	semi: true,
	singleQuote: false,
	trailingComma: "all",
	bracketSpacing: true,
};
```

## NPM Scripts

Add these scripts to your package.json:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --check .",
    "format:fix": "prettier --write ."
  }
}
```

## Advanced Usage

### Custom Rules Configuration

```javascript
import createConfig from "@elsikora/eslint-config";

export default [
	...createConfig({
		withTypescript: true,
	}),
	{
		rules: {
			"@elsikora-typescript/explicit-function-return-type": [
				"error",
				{
					allowExpressions: true,
					allowTypedFunctionExpressions: true,
				},
			],
		},
	},
];
```

### Framework-Specific Paths

```javascript
import createConfig from "@elsikora/eslint-config";

export default [
	{
		files: ["src/**/*.ts"],
		...createConfig({
			withTypescript: true,
			withNest: true,
		}),
	},
	{
		files: ["test/**/*.ts"],
		...createConfig({
			withTypescript: true,
			withJest: true,
		}),
	},
];
```

## 🛣 Roadmap

| Task / Feature                                                               | Status         |
|------------------------------------------------------------------------------|----------------|
| - Add support for Vite and Webpack configurations                            | 🚧 In Progress |
| - Integrate with more test runners (Jest, Vitest)                            | 🚧 In Progress |
| - Add support for more frameworks (Svelte, Vue)                              | 🚧 In Progress |
| - Enhanced monorepo support                                                  | 🚧 In Progress |
| - Custom rule sets for different environments                                | 🚧 In Progress |
| - Integration with more CI/CD platforms                                      | 🚧 In Progress |
| - Performance optimization profiles                                          | 🚧 In Progress |
| - Auto-fix suggestions for common issues                                     | 🚧 In Progress |
| **Completed tasks from CHANGELOG:**                                          |                |
| e130422: Refactor ESLint CLI and feature configurations                      | ✅ Done         |
| 724aa99: Enhance gitignore handling in CLI setup process                     | ✅ Done         |
| 924e701: Add automated .gitignore configuration in CLI setup                 | ✅ Done         |
| 10dd85f: Added GitHub CI and Changesets, bug fixes                           | ✅ Done         |
| c617e39: Added GitHub CI and Changesets, bug fixes                           | ✅ Done         |
| 22b3e8e: Updated                                                             | ✅ Done         |
| 545cdc3: Updated                                                             | ✅ Done         |
| f3ebdb2: Updated                                                             | ✅ Done         |
| feed5d9: Updated                                                             | ✅ Done         |
| 1530118: Updated formats                                                     | ✅ Done         |
| e0207ae: Update                                                              | ✅ Done         |
| eb5978e: Remove ESLint configuration files                                   | ✅ Done         |
| 7faa539: Update eslint-plugin-sonarjs version                                | ✅ Done         |
| da065c9: Update eslint-plugin-unused-imports version                         | ✅ Done         |
| 41904f8: Update src/react.js with new configurations                         | ✅ Done         |
| b7e4114: Add react.js to package.json                                        | ✅ Done         |
| 8ed4d7b: Add support for React in eslint configuration                       | ✅ Done         |
| d1397a2: Add TypeScript resolver to eslint configuration                     | ✅ Done         |
| f39fafb: Update dependency version and eslint format for Readonly properties | ✅ Done         |
| bacf14c: Add Snyk, Qodana, and CodeCommit workflows; update eslint rules     | ✅ Done         |
| 4ea686c: Add peer dependency and refactor README paths                       | ✅ Done         |
| 4855b6a: Update main file and fix README links                               | ✅ Done         |
| 4855b6a: Update main file and fix README links                               | ✅ Done         |
| 8cce705: Update postbuild script and README with detailed configs            | ✅ Done         |
| 909b60d: Optimize build script and update files list in package.json         | ✅ Done         |
| 053c4d9: Refactor package structure and improve build process                | ✅ Done         |
| 1cb8e4c: Convert project to use ECMAScript modules                           | ✅ Done         |
| 68069a5: Update filename and folder naming conventions in configuration      | ✅ Done         |
| de6cf23: Remove specific parserOptions and settings in typescript.js         | ✅ Done         |
| 951eaec: Add detailed linting rules and configurations                       | ✅ Done         |
| ecf92eb: Add readme file and update package.json scripts                     | ✅ Done         |
| 2577937: Added NestJS config                                                 | ✅ Done         |
| 2577937: Added basic JavaScript rules                                        | ✅ Done         |

## ❓ FAQ

### Why use this configuration?

This configuration provides a comprehensive, battle-tested set of rules that enforce consistent code style while
catching potential errors early in development.

### Does it work with [framework]?

Yes! The configuration supports many popular frameworks including React, Angular, NestJS, and more. The setup wizard
will automatically detect your project structure and configure appropriate rules.

### Will it conflict with my existing ESLint config?

The setup wizard will detect existing configurations and help you migrate safely. You can choose to keep or replace
existing configurations during setup.

### How do I customize the rules?

You can extend the base configuration and override specific rules in your `eslint.config.js` file. The configuration is
modular, so you can enable only the features you need.

## 🔒 License

This project is licensed under **MIT**.

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for details.
