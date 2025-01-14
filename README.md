<p align="center">
  <img src="https://i.ibb.co/G5pys9K/ESLint-logo.png" width="200" alt="project-logo">
</p>
<p align="center">
    <h1 align="center">ESLint Config by ElsiKora</h1>
</p>
<p align="center">
    <em>Crafting Consistency, Nesting Best Practices, Enhancing Code Quality</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/ElsiKora/ESLint-Config?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/ElsiKora/ESLint-Config?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/ElsiKora/ESLint-Config?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/ElsiKora/ESLint-Config?style=flat&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
		<em>Developed with the software and tools below.</em>
</p>
<p align="center">
    <a aria-label="ElsiKora logo" href="https://elsikora.com">
        <img src="https://img.shields.io/badge/MADE%20BY%20ElsiKora-212121.svg?style=for-the-badge">
    </a>
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=for-the-badge&logo=Prettier&logoColor=black" alt="Prettier">
	<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=for-the-badge&logo=ESLint&logoColor=white" alt="ESLint">
	<img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=for-the-badge&logo=GitHub-Actions&logoColor=white" alt="GitHub%20Actions">
	<img src="https://img.shields.io/badge/JSON-000000.svg?style=for-the-badge&logo=JSON&logoColor=white" alt="JSON">
</p>

<br>
<details>
  <summary>Table of Contents</summary><br>

- [ Overview](#overview)
- [ Features](#features)
- [ Repository Structure](#repository-structure)
- [ Modules](#modules)
- [ Getting Started](#getting-started)
    - [ Installation](#installation)
    - [ Quick Setup (CLI)](#quick-setup-cli)
    - [ Manual Setup](#manual-setup)
    - [ Example Config](#example-config)
- [ Project Roadmap](#project-roadmap)
- [ Contributing](#contributing)
- [ License](#license)
- [ Acknowledgments](#acknowledgments)

</details>
<hr>

## Overview

The ESLint-Config is a meticulously designed ESLint configuration repository that aims to enhance code quality
and ensure consistency across JavaScript and TypeScript projects. Its core functionalities include custom ESLint rules,
integration with popular plugins like Prettier and Unicorn, and specialized support for NestJS environments. By
outlining standards for filename conventions and the use of modern JavaScript features, alongside automating the release
process for streamlined updates, ESLint-Config offers a comprehensive solution for developers seeking to
enforce coding best practices and style consistency in their projects.

---

## Features

|     | Feature           | Description                                                                                       |
|-----|-------------------|---------------------------------------------------------------------------------------------------|
| ⚙️  | **Architecture**  | ESLint-Config is designed for JS/TS projects, integrating Prettier and Unicorn plugins.           |
| 🔩  | **Code Quality**  | Focuses on consistency & best practices by leveraging eslint, prettier, and custom ESLint rules.  |
| 📄  | **Documentation** | Has basic documentation within code files and `package.json`, outlining usage and contributions.  |
| 🔌  | **Integrations**  | Integrates with GitHub Actions for CI/CD, Changesets for versioning, and Dependabot for updates.  |
| 🧩  | **Modularity**    | Configurations are modular, allowing easy extension and customization for JS/TS projects.         |
| 🧪  | **Testing**       | Comprehensive test coverage for configuration rules and plugin integrations.                      |
| ⚡️  | **Performance**   | Optimized linting performance with selective rule application and caching support.                |
| 🛡️ | **Security**      | Regular dependency updates via Dependabot and security scanning in CI pipeline.                   |
| 📦  | **Dependencies**  | Smart dependency management with automated updates and compatibility checks.                      |
| 🚀  | **Scalability**   | Scalable through the addition of custom rules and extensions for various JavaScript environments. |

---

## Repository Structure

```sh
└── ESLint-Config/
    ├── .github
    │   └── workflows
    ├── .changeset
    │   └── config.js
    ├── CHANGELOG.md
    ├── README.md
    ├── index.enums.ts
    ├── nest.js
    └── package.json
```

---

## Getting Started

### Installation

> Install configuration package:
>
> ```bash
> $ npm install @elsikora/eslint-config --save-dev
> ```

### Quick Setup (CLI)

The easiest way to set up ESLint configuration is using our interactive CLI:

```bash
$ npx @elsikora/eslint-config@latest
```

The CLI will:

1. Guide you through feature selection (JavaScript, TypeScript, React, etc.)
2. Set up ESLint configuration
3. Configure Prettier (optional)
4. Configure Stylelint (optional)
5. Set up IDE configurations (VSCode, WebStorm)
6. Configure GitHub CI workflows (optional)
    - Automated testing and linting
    - Release management with Changesets
    - Dependabot for dependency updates
7. Create all necessary configuration files

### Manual Setup

If you prefer manual setup, create an `.eslintrc.json` file in your project root with one of these configurations:

> **For JavaScript projects:**

```json
{
  "extends": "@elsikora/eslint-config"
}
```

> **For TypeScript projects:**

```json
{
  "extends": "@elsikora/eslint-config/typescript"
}
```

> **For NestJS projects:**

```json
{
  "extends": "@elsikora/eslint-config/nest"
}
```

> **For React projects:**

```json
{
  "extends": "@elsikora/eslint-config/react"
}
```

> **For JSON:**

```json
{
  "extends": "@elsikora/eslint-config/json"
}
```

> **For Yaml:**

```json
{
  "extends": "@elsikora/eslint-config/yaml"
}
```

### Example Config

> Complete `.eslintrc.json` example with all features:

```json
{
  "env": {
    "es6": true,
    "jest": true,
    "node": true
  },
  "extends": [
    "@elsikora/eslint-config",
    "@elsikora/eslint-config/typescript",
    "@elsikora/eslint-config/nest",
    "@elsikora/eslint-config/react",
    "@elsikora/eslint-config/json",
    "@elsikora/eslint-config/yml"
  ],
  "ignorePatterns": [
    ".eslintrc.json"
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "tsconfig.json",
        "tsconfigRootDir": "./"
      }
    }
  ],
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [
        ".ts",
        ".tsx"
      ]
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  },
  "root": true
}
```

---

## Project Roadmap

- [X] `► Interactive CLI Setup`
- [X] `► NestJS Configuration`
- [X] `► React Configuration`
- [X] `► Changesets Integration`
- [X] `► GitHub CI Workflows`
- [ ] `► Next.js Configuration`
- [ ] `► Angular Configuration`
- [ ] `► Vue Configuration`

---

## Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Report Issues](https://github.com/ElsiKora/ESLint-Config.git/issues)**: Submit bugs found or log feature requests.
- **[Submit Pull Requests](https://github.com/ElsiKora/ESLint-Config.git/blob/main/CONTRIBUTING.md)**: Review open PRs,
  and submit your own PRs.
- **[Join the Discussions](https://github.com/ElsiKora/ESLint-Config.git/discussions)**: Share your insights, provide
  feedback, or ask questions.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/ElsiKora/ESLint-Config.git
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and
   their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

---

## License

This project is protected under the MIT License. For more details, refer to
the [LICENSE](https://choosealicense.com/licenses/) file.

---

## Acknowledgments

Thanks to all contributors and users of this configuration package. Special thanks to the ESLint and Prettier teams for
their amazing tools.

[**Return**](#-overview)
