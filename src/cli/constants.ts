import type { IFeatureConfig, ILicenseConfig } from "./types";

export const LICENSE_CONFIGS: Record<string, ILicenseConfig> = {
	"AGPL-3.0": {
		description: "Similar to GPLv3 but requires source code distribution for software running over networks (e.g., web applications)",
		name: "GNU Affero General Public License v3.0",
		template: (year: string, author: string) => `GNU AFFERO GENERAL PUBLIC LICENSE
Version 3, 19 November 2007

Copyright (c) ${year} ${author}

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

Additional permission under GNU GPL version 3 section 7

If you modify this Program, or any covered work, by linking or combining
it with other code, such other code is not for that reason alone subject
to any of the requirements of the GNU Affero GPL version 3.`,
	},
	"Apache-2.0": {
		description: "A permissive license with strong patent protection and requirements for preserving copyright and license notices",
		name: "Apache License 2.0",
		template: (year: string, author: string) => `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.

"License" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.

"Licensor" shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.

"Legal Entity" shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity.

"You" (or "Your") shall mean an individual or Legal Entity exercising permissions granted by this License.

"Source" form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files.

"Object" form shall mean any form resulting from mechanical transformation or translation of a Source form.

"Work" shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work.

"Derivative Works" shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work.

Copyright (c) ${year} ${author}

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`,
	},
	"BSL-1.0": {
		description: "A simple permissive license only requiring preservation of copyright and license notices for source distributions",
		name: "Boost Software License 1.0",
		template: (year: string, author: string) => `Boost Software License - Version 1.0 - August 17th, 2003

Copyright (c) ${year} ${author}

Permission is hereby granted, free of charge, to any person or organization
obtaining a copy of the software and accompanying documentation covered by
this license (the "Software") to use, reproduce, display, distribute,
execute, and transmit the Software, and to prepare derivative works of the
Software, and to permit third-parties to whom the Software is furnished to
do so, all subject to the following:

The copyright notices in the Software and this entire statement, including
the above license grant, this restriction and the following disclaimer,
must be included in all copies of the Software, in whole or in part, and
all derivative works of the Software, unless such copies or derivative
works are solely in the form of machine-executable object code generated by
a source language processor.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE FOR ANY DAMAGES OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`,
	},
	"GPL-3.0": {
		description: "A copyleft license that requires anyone who distributes your code or a derivative work to make the source available under the same terms",
		name: "GNU General Public License v3.0",
		template: (year: string, author: string) => `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (c) ${year} ${author}

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.`,
	},
	ISC: {
		description: "A permissive license letting people do anything with your code with proper attribution and without warranty",
		name: "ISC License",
		template: (year: string, author: string) => `ISC License

Copyright (c) ${year} ${author}

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.`,
	},
	"LGPL-3.0": {
		description: "A copyleft license that permits use in proprietary software while maintaining copyleft for the LGPL-licensed components",
		name: "GNU Lesser General Public License v3.0",
		template: (year: string, author: string) => `GNU LESSER GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (c) ${year} ${author}

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.`,
	},
	MIT: {
		description: "A short and simple permissive license with conditions only requiring preservation of copyright and license notices",
		name: "MIT License",
		template: (year: string, author: string) => `MIT License

Copyright (c) ${year} ${author}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
	},
	"MPL-2.0": {
		description: "A copyleft license that is file-based and allows inclusion in larger works under different licenses",
		name: "Mozilla Public License 2.0",
		template: (year: string, author: string) => `Mozilla Public License Version 2.0
==================================

Copyright (c) ${year} ${author}

1. Definitions
--------------

1.1. "Contributor"
    means each individual or legal entity that creates, contributes to
    the creation of, or owns Covered Software.

1.2. "Contributor Version"
    means the combination of the Contributions of others (if any) used
    by a Contributor and that particular Contributor's Contribution.

1.3. "Contribution"
    means Covered Software of a particular Contributor.

1.4. "Covered Software"
    means Source Code Form to which the initial Contributor has attached
    the notice in Exhibit A, the Executable Form of such Source Code
    Form, and Modifications of such Source Code Form, in each case
    including portions thereof.

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.`,
	},
	Unlicense: {
		description: "A license with no conditions whatsoever which dedicates works to the public domain",
		name: "The Unlicense",
		template: (_year: string, _author: string) => `This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>`,
	},
};

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
