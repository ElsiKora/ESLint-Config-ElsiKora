import type { IFeatureConfig } from "./types";

export const FEATURES_CONFIG: Record<string, IFeatureConfig> = {
	javascript: {
		packages: [],
		required: true,
		description: "JavaScript support",
	},
	typescript: {
		packages: ["typescript", "@typescript-eslint/parser", "@typescript-eslint/eslint-plugin", "typescript-eslint"],
		detect: ["typescript", "@types/node"],
		description: "TypeScript support",
		requiresTypescript: true,
	},
	react: {
		packages: ["@eslint-react/eslint-plugin"],
		detect: ["react", "react-dom", "@types/react"],
		description: "React framework support",
	},
	nest: {
		packages: ["eslint-plugin-ng-module-sort", "@elsikora/eslint-plugin-nestjs-typed"],
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
		packages: ["eslint-plugin-prettier", "eslint-config-prettier", "prettier"],
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
		packages: ["eslint-plugin-typeorm-typescript"],
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

export const GITHUB_CI_FILES = {
	CODECOMMIT_SYNC: {
		name: "codecommit-sync.yml",
		description: "Mirror repository to AWS CodeCommit",
	},
	QODANA: {
		name: "qodana-code-quality.yml",
		description: "JetBrains Qodana code quality scan",
	},
	RELEASE_NPM: {
		name: "release.yml",
		description: "Release workflow",
	},
	SNYK: {
		name: "snyk-security-scan.yml",
		description: "Snyk security scanning",
	},
	DEPENDABOT: {
		name: "dependabot.yml",
		description: "Automated dependency updates",
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
};
