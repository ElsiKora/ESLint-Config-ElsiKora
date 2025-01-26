import type { IFeatureConfig } from "./types";

export const FEATURES_CONFIG: Record<string, IFeatureConfig> = {
	checkFile: {
		description: "File naming rules",
		packages: ["eslint-plugin-check-file"],
	},
	javascript: {
		description: "JavaScript support",
		packages: [],
		required: true,
	},
	json: {
		description: "JSON files support",
		packages: ["eslint-plugin-jsonc"],
	},
	nest: {
		description: "NestJS framework support",
		detect: ["@nestjs/core", "@nestjs/common"],
		packages: ["eslint-plugin-ng-module-sort", "@elsikora/eslint-plugin-nestjs-typed"],
		requiresTypescript: true,
	},
	node: {
		description: "Node.js specific rules",
		detect: ["node", "@types/node"],
		packages: ["eslint-plugin-n"],
	},
	packageJson: {
		description: "package.json linting",
		packages: ["eslint-plugin-package-json"],
	},
	perfectionist: {
		description: "Code organization rules",
		packages: ["eslint-plugin-perfectionist"],
	},
	prettier: {
		description: "Prettier integration",
		detect: ["prettier"],
		packages: ["eslint-plugin-prettier", "eslint-config-prettier", "prettier"],
	},
	react: {
		description: "React framework support",
		detect: ["react", "react-dom", "@types/react"],
		packages: ["@eslint-react/eslint-plugin"],
	},
	regexp: {
		description: "RegExp linting",
		packages: ["eslint-plugin-regexp"],
	},
	sonar: {
		description: "SonarJS code quality rules",
		packages: ["eslint-plugin-sonarjs"],
	},
	stylistic: {
		description: "Stylistic rules",
		packages: ["@stylistic/eslint-plugin"],
	},
	tailwindCss: {
		description: "Tailwind CSS support",
		detect: ["tailwindcss"],
		packages: ["eslint-plugin-tailwindcss"],
	},
	typeorm: {
		description: "TypeORM support",
		detect: ["typeorm", "@typeorm/core"],
		packages: ["eslint-plugin-typeorm-typescript"],
		requiresTypescript: true,
	},
	typescript: {
		description: "TypeScript support",
		detect: ["typescript", "@types/node"],
		packages: ["typescript", "@typescript-eslint/parser", "@typescript-eslint/eslint-plugin", "typescript-eslint"],
		requiresTypescript: true,
	},
	unicorn: {
		description: "Unicorn rules",
		packages: ["eslint-plugin-unicorn"],
	},
	yaml: {
		description: "YAML files support",
		packages: ["eslint-plugin-yml"],
	},
} as const;

export const FEATURE_GROUPS: Record<string, Array<string>> = {
	"Code Quality": ["sonar", "unicorn", "perfectionist"],
	"Core Features": ["javascript", "typescript"],
	"File Types": ["json", "yaml", "checkFile", "packageJson"],
	Frameworks: ["react", "nest"],
	"Other Tools": ["node", "regexp", "typeorm"],
	Styling: ["tailwindCss", "prettier", "stylistic"],
} as const;

export const ESLINT_CONFIG_FILES: Array<string> = ["eslint.config.js", "eslint.config.cjs", "eslint.config.mjs", ".eslintrc.js", ".eslintrc.cjs", ".eslintrc.yaml", ".eslintrc.yml", ".eslintrc.json", ".eslintrc", ".eslintignore"];

export const PRETTIER_CONFIG_FILES: Array<string> = ["prettier.config.js", "prettier.config.cjs", "prettier.config.mjs", ".prettierrc", ".prettierrc.js", ".prettierrc.cjs", ".prettierrc.json", ".prettierrc.yaml", ".prettierrc.yml", ".prettierignore"];

export const STYLELINT_CONFIG_FILES: Array<string> = ["stylelint.config.js", "stylelint.config.cjs", "stylelint.config.mjs", ".stylelintrc", ".stylelintrc.js", ".stylelintrc.cjs", ".stylelintrc.json", ".stylelintrc.yaml", ".stylelintrc.yml", ".stylelintignore"];

export const CORE_DEPENDENCIES: Array<string> = ["@elsikora/eslint-config", "@eslint/js", "@eslint/compat", "@types/eslint__js"];

export const GITHUB_CI_FILES = {
	CODECOMMIT_SYNC: {
		description: "Mirror repository to AWS CodeCommit",
		name: "codecommit-sync.yml",
	},
	DEPENDABOT: {
		description: "Automated dependency updates",
		name: "dependabot.yml",
	},
	QODANA: {
		description: "JetBrains Qodana code quality scan",
		name: "qodana-code-quality.yml",
	},
	RELEASE_NPM: {
		description: "Release workflow",
		name: "release.yml",
	},
	SNYK: {
		description: "Snyk security scanning",
		name: "snyk-security-scan.yml",
	},
} as const;

export const CI_FILE_CONTENTS = {
	CODECOMMIT_SYNC: `name: Mirror to CodeCommit
on: push

jobs:
  mirror_to_codecommit:
    name: Mirror to CodeCommit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Mirror to CodeCommit
        uses: pixta-dev/repository-mirroring-action@v1
        with:
          target_repo_url: \${{ secrets.CODECOMMIT_SSH_REPOSITORY_URL }}
          ssh_private_key: \${{ secrets.CODECOMMIT_SSH_PRIVATE_KEY }}
          ssh_username: \${{ secrets.CODECOMMIT_SSH_PRIVATE_KEY_ID }}`,

	DEPENDABOT: `version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    target-branch: "dev"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "daily"
    target-branch: "dev"`,

	QODANA: `name: Qodana Quality Scan
on: push

jobs:
  qodana:
    name: Qodana Quality Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Dependencies
        run: npm install

      - name: Qodana Scan
        uses: JetBrains/qodana-action@v2023.3
        env:
          QODANA_TOKEN: \${{ secrets.QODANA_TOKEN }}`,

	RELEASE_NON_NPM: `name: Release and Publish
on:
  push:
    branches:
      - main
      - dev

jobs:
  changesets:
    runs-on: ubuntu-latest
    outputs:
      hasChangesets: \${{ steps.changesets.outputs.hasChangesets }}
      publishedPackages: \${{ steps.changesets.outputs.publishedPackages }}
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Dependencies
        run: yarn install

      - name: Create Release Pull Request
        id: changesets
        uses: changesets/action@v1
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

  prepare-release-info:
    needs: changesets
    runs-on: ubuntu-latest
    outputs:
      version: \${{ steps.get_version.outputs.version }}
      release_notes: \${{ steps.generate_release_notes.outputs.release_notes }}
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: List tags
        run: git tag

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Get package version
        id: get_version
        run: echo "::set-output name=version::$(jq -r '.version' package.json)"

      - name: Generate release notes
        id: generate_release_notes
        run: |
          notes=$(git log $(git describe --tags --abbrev=0)..HEAD --pretty=format:"%h: %s")
          if [ -z "$notes" ]; then
            echo "No new changes to release."
            notes="No new changes."
          fi
          echo "::set-output name=release_notes::$(echo "$notes" | base64)"

  github-release:
    needs: prepare-release-info
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Decode Release Notes
        id: decode
        run: echo "::set-output name=release_notes::$(echo '\${{ needs.prepare-release-info.outputs.release_notes }}' | base64 --decode)"

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: \${{ needs.prepare-release-info.outputs.version }}
          release_name: Release \${{ needs.prepare-release-info.outputs.version }}
          body: \${{ steps.decode.outputs.release_notes }}
          draft: false
          prerelease: false`,

	RELEASE_NPM: `name: Release
on:
  push:
    branches:
      - main

concurrency: \${{ github.workflow }}-\${{ github.ref }}
jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v4

      - name: Setup Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
      - name: Install Dependencies
        run: yarn

      - name: Create Release Pull Request or Publish to NPM
        id: changesets
        uses: changesets/action@v1
        with:
          publish: yarn release
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}`,

	SNYK: `name: Snyk Security Scan
on: push

jobs:
  build:
    name: Snyk Security Scan
    environment: snyk-npm
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Setup Snyk
        run: |
          npm install snyk -g
          npm install snyk-to-html -g
          snyk auth \${{ secrets.SNYK_TOKEN }}

      - name: Install dependencies
        run: npm install

      - name: Snyk Open Source
        run: |
          snyk monitor

      - name: Snyk Code
        run: |
          snyk code test || true

      - name: Snyk IaC
        run: |
          snyk iac test || true`,
};
