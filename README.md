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
	<img src="https://img.shields.io/github/license/ElsiKora/ESLint-Config-ElsiKora?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/ElsiKora/ESLint-Config-ElsiKora?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/ElsiKora/ESLint-Config-ElsiKora?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/ElsiKora/ESLint-Config-ElsiKora?style=flat&color=0080ff" alt="repo-language-count">
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

<br><!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary><br>

- [ Overview](#-overview)
- [ Features](#-features)
- [ Repository Structure](#-repository-structure)
- [ Modules](#-modules)
- [ Getting Started](#-getting-started)
    - [ Installation](#-installation)
    - [ Usage](#-usage)
    - [ Tests](#-tests)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ Acknowledgments](#-acknowledgments)

</details>
<hr>

## Overview

The ESLint-Config-ElsiKora is a meticulously designed ESLint configuration repository that aims to enhance code quality
and ensure consistency across JavaScript and TypeScript projects. Its core functionalities include custom ESLint rules,
integration with popular plugins like Prettier and Unicorn, and specialized support for NestJS environments. By
outlining standards for filename conventions and the use of modern JavaScript features, alongside automating the release
process for streamlined updates, ESLint-Config-ElsiKora offers a comprehensive solution for developers seeking to
enforce coding best practices and style consistency in their projects.

---

## Features

|     | Feature           | Description                                                                                       |
|-----|-------------------|---------------------------------------------------------------------------------------------------|
| ⚙️  | **Architecture**  | ESLint-Config-ElsiKora is designed for JS/TS projects, integrating Prettier and Unicorn plugins.  |
| 🔩  | **Code Quality**  | Focuses on consistency & best practices by leveraging eslint, prettier, and custom ESLint rules.  |
| 📄  | **Documentation** | Has basic documentation within code files and `package.json`, outlining usage and contributions.  |
| 🔌  | **Integrations**  | Integrates with GitHub Actions for CI/CD, and uses `@changesets/cli` for release management.      |
| 🧩  | **Modularity**    | Configurations are modular, allowing easy extension and customization for JS/TS projects.         |
| 🧪  | **Testing**       | No specific testing tools mentioned, focus is on linting and code style consistency.              |
| ⚡️  | **Performance**   | Performance impact is minimal, primarily affects development through linting processes.           |
| 🛡️ | **Security**      | No specific security measures mentioned, as it's a development tool focusing on code quality.     |
| 📦  | **Dependencies**  | Depends on various eslint plugins and configurations, including `eslint-plugin-prettier`.         |
| 🚀  | **Scalability**   | Scalable through the addition of custom rules and extensions for various JavaScript environments. |

```

---

##  Repository Structure

```sh
└── ESLint-Config-ElsiKora/
    ├── .github
    │   └── workflows
    ├── CHANGELOG.md
    ├── README.md
    ├── index.js
    ├── nest.js
    └── package.json
```

---

## Modules

| File                                                                                    | Summary                                                                                                                                                                                                                                                                                                                 |
|-----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [index.js](https://github.com/ElsiKora/ESLint-Config-ElsiKora.git/blob/master/index.js) | Defines and customizes ESLint rules for the ESLint-Config-ElsiKora repository, focusing on ensuring code consistency while providing flexibility in filename conventions and the use of top-level await, by integrating popular ESLint configurations and plugins like Prettier and Unicorn.                            |
| [nest.js](https://github.com/ElsiKora/ESLint-Config-ElsiKora.git/blob/master/nest.js)   | Defines the ESLint configuration specifically for NestJS projects within the ESLint-Config-ElsiKora repository. It selects an environment supporting ES2021 and Node.js, extending recommended settings from a custom plugin designed to enforce typing conventions and best practices tailored for NestJS development. |

---

## Getting Started

**System Requirements:**

* **ESLint**: `>= 8.0.0`
* **Prettier**: `>= 3.0.0`

### Installation

> Install configuration from the repository using the command below:
>
> ```bash
> $ npm install @elsikora/eslint-config-elsikora --save-dev
> ```

---

### Usage

To configure ESLint for your project, first install the necessary package(s) based on your project type. Then, create
a `.eslintrc.json` file in your project root (if you haven't already) and add the corresponding configuration:

> **For JavaScript projects:**
>
>  ```json
>  {
>    "extends": "@elsikora/elsikora"
>  }
> ```

> **For NestJS projects:**
>
>  ```json
>  {
>    "extends": "@elsikora/elsikora/nest"
>  }
> ```

## Project Roadmap

- [X] `► NestJS Configuration`
- [ ] `► React Configuration`
- [ ] `► Next.js Configuration`

---

## Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Report Issues](https://github.com/ElsiKora/ESLint-Config-ElsiKora.git/issues)**: Submit bugs found or log feature
  requests for the `ESLint-Config-ElsiKora` project.
- **[Submit Pull Requests](https://github.com/ElsiKora/ESLint-Config-ElsiKora.git/blob/main/CONTRIBUTING.md)**: Review
  open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/ElsiKora/ESLint-Config-ElsiKora.git/discussions)**: Share your insights,
  provide feedback, or ask questions.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/ElsiKora/ESLint-Config-ElsiKora.git
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
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your
   contribution!

</details>

---

## License

This project is protected under the [SELECT-A-LICENSE](https://choosealicense.com/licenses) License. For more details,
refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

## Acknowledgments

- List any resources, contributors, inspiration, etc. here.

[**Return**](#-overview)

---
