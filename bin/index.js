#!/usr/bin/env node
import { exec as exec$3 } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { intro, confirm, outro, spinner, note } from '@clack/prompts';
import inquirer from 'inquirer';
import color from 'picocolors';

const FRAMEWORK_CONFIGS = [
    {
        ignorePaths: {
            directories: [".next/", "out/"],
            patterns: ["next-env.d.ts", "next.config.js", "next.config.mjs", "**/node_modules/**/*", "**/.git/**/*"],
        },
        lintPaths: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
        name: "next",
        packageIndicators: ["next"],
    },
    {
        ignorePaths: {
            directories: [".cache/", "build/", "public/build/"],
            patterns: ["remix.config.js", "remix.config.ts", "**/node_modules/**/*", "**/.git/**/*"],
        },
        lintPaths: ["./app/**/*.{js,jsx,ts,tsx}"],
        name: "remix",
        packageIndicators: ["@remix-run/react", "@remix-run/node"],
    },
    {
        ignorePaths: {
            directories: [".cache/", "public/"],
            patterns: ["gatsby-*.js", "gatsby-*.ts", "**/node_modules/**/*", "**/.git/**/*"],
        },
        lintPaths: ["./src/**/*.{js,jsx,ts,tsx}", "./gatsby-*.{js,ts}"],
        name: "gatsby",
        packageIndicators: ["gatsby"],
    },
    {
        ignorePaths: {
            directories: ["dist/", ".nuxt/", ".output/"],
            patterns: ["*.config.{js,ts}", "*.config.*.{js,ts}", "**/node_modules/**/*", "**/.git/**/*"],
        },
        lintPaths: ["./src/**/*.{js,ts,vue}", "./components/**/*.{js,ts,vue}", "./pages/**/*.{js,ts,vue}"],
        name: "vue",
        packageIndicators: ["vue", "nuxt", "@nuxt/core"],
    },
    {
        fileIndicators: ["angular.json"],
        ignorePaths: {
            directories: ["dist/", ".angular/", "coverage/"],
            patterns: ["*.spec.ts", "*.conf.js", "e2e/**/*", "**/node_modules/**/*", "**/.git/**/*"],
        },
        lintPaths: ["./src/**/*.{js,ts}", "./projects/**/*.{js,ts}"],
        name: "angular",
        packageIndicators: ["@angular/core"],
    },
    {
        ignorePaths: {
            directories: ["dist/", "coverage/", ".nest/"],
            patterns: ["*.spec.ts", "test/**/*", "**/node_modules/**/*", "**/.git/**/*", "nest-cli.json"],
        },
        lintPaths: ["./src/**/*.ts"],
        name: "nest",
        packageIndicators: ["@nestjs/core", "@nestjs/common"],
    },
    {
        ignorePaths: {
            directories: ["dist/", "build/"],
            patterns: ["*.test.{js,ts}", "*.spec.{js,ts}", "**/node_modules/**/*", "**/.git/**/*"],
        },
        lintPaths: ["./src/**/*.{js,ts}", "./routes/**/*.{js,ts}", "./api/**/*.{js,ts}", "./middleware/**/*.{js,ts}"],
        name: "express",
        packageIndicators: ["express"],
    },
    {
        ignorePaths: {
            directories: ["dist/", "build/"],
            patterns: ["*.test.{js,ts}", "*.spec.{js,ts}", "**/node_modules/**/*", "**/.git/**/*"],
        },
        lintPaths: ["./src/**/*.{js,ts}", "./routes/**/*.{js,ts}", "./api/**/*.{js,ts}", "./middleware/**/*.{js,ts}"],
        name: "koa",
        packageIndicators: ["koa"],
    },
    {
        ignorePaths: {
            directories: ["dist/", "build/"],
            patterns: ["*.test.{js,ts}", "*.spec.{js,ts}", "**/node_modules/**/*", "**/.git/**/*"],
        },
        lintPaths: ["./src/**/*.{js,ts}", "./routes/**/*.{js,ts}", "./plugins/**/*.{js,ts}", "./services/**/*.{js,ts}"],
        name: "fastify",
        packageIndicators: ["fastify"],
    },
    {
        ignorePaths: {
            directories: ["dist/", ".astro/"],
            patterns: ["astro.config.mjs", "**/node_modules/**/*", "**/.git/**/*"],
        },
        lintPaths: ["./src/**/*.{js,ts,astro}", "./pages/**/*.{js,ts,astro}", "./components/**/*.{js,ts,astro}"],
        name: "astro",
        packageIndicators: ["astro"],
    },
    {
        ignorePaths: {
            directories: ["build/", ".svelte-kit/"],
            patterns: ["svelte.config.js", "vite.config.js", "**/node_modules/**/*", "**/.git/**/*"],
        },
        lintPaths: ["./src/**/*.{js,ts,svelte}", "./routes/**/*.{js,ts,svelte}"],
        name: "svelte",
        packageIndicators: ["svelte", "@sveltejs/kit"],
    },
];
async function detectProjectStructure() {
    try {
        const packageJsonPath = path.resolve(process.cwd(), "package.json");
        const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
        const packageJson = JSON.parse(packageJsonContent);
        const allDependencies = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
        };
        // @ts-ignore
        // eslint-disable-next-line @elsikora-typescript/typedef
        const hasTypescript = !!(allDependencies.typescript || allDependencies["@types/node"]);
        // Detect framework based on package.json dependencies and file indicators
        for (const config of FRAMEWORK_CONFIGS) {
            // @ts-ignore
            // eslint-disable-next-line @elsikora-typescript/typedef
            const hasPackageIndicators = config.packageIndicators.some((package_) => !!allDependencies[package_]);
            if (hasPackageIndicators) {
                // If there are file indicators, check them too
                if (config.fileIndicators) {
                    // eslint-disable-next-line @elsikora-typescript/typedef,no-await-in-loop
                    const hasFileIndicators = await Promise.all(config.fileIndicators.map((file) => fileExists(file)));
                    if (hasFileIndicators.some(Boolean)) {
                        return {
                            customPaths: [],
                            framework: { framework: config, hasTypescript },
                        };
                    }
                }
                else {
                    return {
                        customPaths: [],
                        framework: { framework: config, hasTypescript },
                    };
                }
            }
        }
        // If no framework detected, look for source directories
        const sourceDirectories = await detectSourceDirectory();
        if (sourceDirectories.length > 0) {
            const extensions = hasTypescript ? "{js,jsx,ts,tsx}" : "{js,jsx}";
            return {
                customPaths: sourceDirectories.map((dir) => `./${dir}/**/*.${extensions}`),
                framework: null,
            };
        }
        // Fallback to scanning current directory
        return {
            customPaths: [`./**/*.${hasTypescript ? "{js,jsx,ts,tsx}" : "{js,jsx}"}`],
            framework: null,
        };
    }
    catch {
        return {
            customPaths: ["./**/*.{js,jsx,ts,tsx}"],
            framework: null,
        };
    }
}
function generateIgnoreConfig(framework) {
    const commonIgnores = [
        "**/node_modules/",
        "**/package-lock.json",
        "**/yarn.lock",
        "**/pnpm-lock.yaml",
        "**/.npm",
        "**/.pnpm",
        "**/.yarn",
        "**/dist/",
        "**/build/",
        "**/coverage/",
        "**/*.min.js",
        "**/*.bundle.js",
        "**/.vscode/",
        "**/.idea/",
        "**/.vs/",
        "**/.DS_Store",
        "**/.git/",
        "**/.gitignore",
        "**/tmp/",
        "**/temp/",
        "**/*.tmp",
        "**/*.temp",
        "**/._*",
        "**/*.log",
        "**/logs/",
        "**/.cache/",
        "**/.eslintcache",
        "**/.stylelintcache",
        "**/tsconfig.tsbuildinfo",
        "**/.env",
        "**/.env.*",
        "**/*.pem",
        "**/*.key",
        "**/.nyc_output",
        "**/coverage-report/",
        "**/Thumbs.db",
        "**/ehthumbs.db",
        "**/desktop.ini",
    ];
    if (framework) {
        const { directories, patterns, } = framework.framework.ignorePaths;
        // Convert directory ignores to proper format
        const directoryIgnores = directories.map((dir) => (dir.endsWith("/") ? `**/${dir}**/*` : `**/${dir}/**/*`));
        // Combine all ignores
        return {
            ignores: [...commonIgnores, ...directoryIgnores, ...patterns],
            lintPaths: framework.framework.lintPaths,
        };
    }
    return {
        ignores: commonIgnores,
        lintPaths: [],
    };
}
function generateLintCommands(framework, customPaths, includeStylelint, includePrettier) {
    // Convert paths to directory patterns
    const basePaths = framework?.framework.lintPaths ?? customPaths;
    const directoryPaths = basePaths.map((path) => {
        // Remove file pattern from path to get directory
        return path.split("/*")[0];
    });
    // Get unique directories
    // eslint-disable-next-line @elsikora-sonar/no-dead-store,@elsikora-sonar/no-unused-vars,@elsikora-typescript/no-unused-vars
    [...new Set(directoryPaths)];
    const commands = {
        // fix: [`eslint ${uniqueDirectories.join(" ")} --fix`],
        // lint: [`eslint ${uniqueDirectories.join(" ")}`],
        fix: [`eslint ./ --fix`],
        lint: [`eslint ./`],
    };
    if (includeStylelint) {
        commands.lint.push('stylelint "**/*.{css,scss,less}"');
        commands.fix.push('stylelint "**/*.{css,scss,less}" --fix');
    }
    if (includePrettier) {
        commands.lint.push("prettier --check .");
        commands.fix.push("prettier --write .");
    }
    return {
        lintCommand: commands.lint.join(" && "),
        lintFixCommand: commands.fix.join(" && "),
    };
}
async function detectSourceDirectory() {
    const commonDirectories = ["src", "app", "source", "lib"];
    const existingDirectories = [];
    for (const directory of commonDirectories) {
        // eslint-disable-next-line no-await-in-loop
        if (await fileExists(directory)) {
            existingDirectories.push(directory);
        }
    }
    return existingDirectories;
}
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}

async function checkForEslintConfigInPackageJson() {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    return Object.prototype.hasOwnProperty.call(packageJson, "eslintConfig");
}
async function checkForPrettierConfigInPackageJson() {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    return Object.prototype.hasOwnProperty.call(packageJson, "prettier");
}
async function checkForStylelintConfigInPackageJson() {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    return Object.prototype.hasOwnProperty.call(packageJson, "stylelint");
}
async function createEslintConfig(features, extension, detectedFramework) {
    const { ignores } = generateIgnoreConfig(detectedFramework);
    const configContent = `import { createConfig } from '@elsikora/eslint-config';

const config = {
  ignores: ${JSON.stringify(ignores, null, 2)}
};

export default await createConfig({
${features.map((feature) => `  with${feature.charAt(0).toUpperCase() + feature.slice(1)}: true`).join(",\n")}
});
`;
    await fs.writeFile(`eslint.config${extension}`, configContent, "utf8");
}
async function createPrettierConfig(extension) {
    const prettierConfigContent = `export default {
  useTabs: true,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: true,
  arrowParens: 'always',
  printWidth: 480,
  proseWrap: 'never',
};
`;
    await fs.writeFile(`prettier.config${extension}`, prettierConfigContent, "utf-8");
    const prettierIgnoreContent = `node_modules
dist
build
`;
    await fs.writeFile(".prettierignore", prettierIgnoreContent, "utf-8");
}
async function getConfigFileExtension() {
    try {
        const packageJsonPath = path.resolve(process.cwd(), "package.json");
        const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
        const packageJson = JSON.parse(packageJsonContent);
        const isModule = packageJson.type === "module";
        return ".js";
        // return isModule ? ".mjs" : ".cjs";
    }
    catch {
        return ".js";
    }
}
async function removeEslintConfigFromPackageJson() {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    if (packageJson.eslintConfig) {
        delete packageJson.eslintConfig;
        // eslint-disable-next-line @elsikora-typescript/no-magic-numbers
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
    }
}
async function removePrettierConfigFromPackageJson() {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    if (packageJson.prettier) {
        delete packageJson.prettier;
        // eslint-disable-next-line @elsikora-typescript/no-magic-numbers
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
    }
}
async function removeStylelintConfigFromPackageJson() {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    if (packageJson.stylelint) {
        delete packageJson.stylelint;
        // eslint-disable-next-line @elsikora-typescript/no-magic-numbers
        await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
    }
}
async function updatePackageJson(framework, customPaths, includePrettier = false, includeStylelint) {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    packageJson.type = "module";
    // Generate lint paths and commands
    const { lintCommand, lintFixCommand, } = generateLintCommands(framework, customPaths, !!includeStylelint, includePrettier);
    // Generate watch commands if framework supports it
    let watchCommands = {};
    if (framework) {
        switch (framework.framework.name) {
            case "express":
            case "fastify":
            case "koa":
            case "nest":
            case "next": {
                watchCommands = {
                    "lint:watch": `npx eslint-watch ${framework.framework.lintPaths.join(" ")}`,
                };
                break;
            }
        }
    }
    // Generate framework-specific validation scripts
    let frameworkScripts = {};
    if (framework) {
        switch (framework.framework.name) {
            case "angular": {
                frameworkScripts = {
                    "lint:all": "ng lint && npm run lint:types && npm run lint:test",
                    "lint:test": 'eslint "**/*.spec.ts"',
                    "lint:types": "tsc --noEmit",
                };
                break;
            }
            case "nest": {
                frameworkScripts = {
                    "lint:all": "npm run lint && npm run lint:types && npm run lint:test",
                    "lint:test": 'eslint "{src,apps,libs,test}/**/*.spec.ts"',
                    "lint:types": "tsc --noEmit",
                };
                break;
            }
            case "next": {
                frameworkScripts = {
                    "lint:all": "npm run lint && npm run lint:types",
                    "lint:types": "tsc --noEmit",
                };
                break;
            }
        }
    }
    // Generate type checking script if TypeScript is used
    const typeScripts = framework?.hasTypescript
        ? {
            "lint:all": `npm run lint${framework?.hasTypescript ? " && npm run lint:types" : ""}`,
            "lint:types": "tsc --noEmit",
        }
        : {};
    // Combine all scripts
    // @ts-ignore
    packageJson.scripts = {
        ...packageJson.scripts,
        lint: lintCommand,
        "lint:fix": lintFixCommand,
        ...(includePrettier && {
            format: "prettier --check .",
            "format:fix": "prettier --write .",
        }),
        ...watchCommands,
        ...frameworkScripts,
        ...typeScripts,
    };
    // eslint-disable-next-line @elsikora-typescript/no-magic-numbers
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
}

const LICENSE_CONFIGS = {
    "AGPL-3.0": {
        description: "Similar to GPLv3 but requires source code distribution for software running over networks (e.g., web applications)",
        name: "GNU Affero General Public License v3.0",
        template: (year, author) => `GNU AFFERO GENERAL PUBLIC LICENSE
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
        template: (year, author) => `Apache License
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
        template: (year, author) => `Boost Software License - Version 1.0 - August 17th, 2003

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
        template: (year, author) => `GNU GENERAL PUBLIC LICENSE
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
        template: (year, author) => `ISC License

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
        template: (year, author) => `GNU LESSER GENERAL PUBLIC LICENSE
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
        template: (year, author) => `MIT License

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
        template: (year, author) => `Mozilla Public License Version 2.0
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
        template: (_year, _author) => `This is free and unencumbered software released into the public domain.

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
const FEATURES_CONFIG = {
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
};
const FEATURE_GROUPS = {
    "Code Quality": ["sonar", "unicorn", "perfectionist"],
    "Core Features": ["javascript", "typescript"],
    "File Types": ["json", "yaml", "checkFile", "packageJson"],
    Frameworks: ["react", "nest"],
    "Other Tools": ["node", "regexp", "typeorm"],
    Styling: ["tailwindCss", "prettier", "stylistic"],
};
const ESLINT_CONFIG_FILES = ["eslint.config.js", "eslint.config.cjs", "eslint.config.mjs", ".eslintrc.js", ".eslintrc.cjs", ".eslintrc.yaml", ".eslintrc.yml", ".eslintrc.json", ".eslintrc", ".eslintignore"];
const PRETTIER_CONFIG_FILES = ["prettier.config.js", "prettier.config.cjs", "prettier.config.mjs", ".prettierrc", ".prettierrc.js", ".prettierrc.cjs", ".prettierrc.json", ".prettierrc.yaml", ".prettierrc.yml", ".prettierignore"];
const STYLELINT_CONFIG_FILES = ["stylelint.config.js", "stylelint.config.cjs", "stylelint.config.mjs", ".stylelintrc", ".stylelintrc.js", ".stylelintrc.cjs", ".stylelintrc.json", ".stylelintrc.yaml", ".stylelintrc.yml", ".stylelintignore"];
const CORE_DEPENDENCIES = ["@elsikora/eslint-config", "@eslint/js", "@eslint/compat", "@types/eslint__js"];
const GITHUB_CI_FILES = {
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
};
const CI_FILE_CONTENTS = {
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

async function setupGitHubCIConfig(selectedFiles, isNpmPackage = false, dependabotBranch = "dev") {
    const githubDir = path.resolve(process.cwd(), ".github");
    const workflowsDir = path.resolve(githubDir, "workflows");
    // Create .github and workflows directories
    await fs.mkdir(workflowsDir, { recursive: true });
    for (const file of selectedFiles) {
        let content;
        // Special handling for release.yml
        if (file === "RELEASE_NPM") {
            content = isNpmPackage ? CI_FILE_CONTENTS.RELEASE_NPM : CI_FILE_CONTENTS.RELEASE_NON_NPM;
            await fs.writeFile(path.resolve(workflowsDir, GITHUB_CI_FILES[file].name), content, "utf-8");
            continue;
        }
        // Handle other files
        content = CI_FILE_CONTENTS[file];
        // Modify dependabot.yml content if it's being created
        if (file === "DEPENDABOT") {
            content = `version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    target-branch: "${dependabotBranch}"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "daily"
    target-branch: "${dependabotBranch}"`;
            await fs.writeFile(path.resolve(githubDir, GITHUB_CI_FILES[file].name), content, "utf-8");
        }
        else {
            await fs.writeFile(path.resolve(workflowsDir, GITHUB_CI_FILES[file].name), content, "utf-8");
        }
    }
}

const DEFAULT_GITIGNORE_CONTENT = `# Compiled output
/dist/
/build/
/out/
/tmp/
/temp/

# Dependency directories
/node_modules/
jspm_packages/
.pnp/
.pnp.js
.yarn/
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# Logs
logs/
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Error logs
*.log.*

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
[Dd]esktop.ini

# Tests
/coverage/
/.nyc_output/
.jest/
junit.xml
/cypress/videos/
/cypress/screenshots/
/test-results/
/playwright-report/
/e2e-results/

# IDEs and editors
/.idea/
/.vscode/
*.sublime-workspace
*.sublime-project
/.atom/
/.emacs.d/
/.ensime_cache/
/.nvim/
/.c9/
*.launch
.settings/
.project
.classpath
*.iml
*.ipr
*.iws
.idea_modules/
*.code-workspace
.history/

# IDE - Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.vs/

# Environment variables
.env
.env.*
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local
*.env
.envrc

# Cloud Platform Files
.elasticbeanstalk/*
!.elasticbeanstalk/*.cfg.yml
!.elasticbeanstalk/*.global.yml
.pestenska/*
.vercel
.now
.netlify
.deployment/
.terraform/
*.tfstate
*.tfstate.*
.vagrant/

# Dependency lock files
/package-lock.json
/yarn.lock
/pnpm-lock.yaml
/bun.lockb
*.lock-wscript
composer.lock
Gemfile.lock

# Runtime data
*.pid
*.pid.lock
*.seed
*.pid.db
pids/
*.pid

# System Files
.husky/
.git-rewrite/

# Process Managers
.pm2/
ecosystem.config.js
process.json

# Framework specific
# Next.js
.next/
out/
next-env.d.ts

# Nuxt.js
.nuxt/
dist/
.output/

# Gatsby
.cache/
public/

# Vue
.vue-test-utils/

# React
.react-debug/
storybook-static/

# Angular
.angular/
dist/
tmp/
/connect.lock
/libpeerconnection.log

# Docusaurus
.docusaurus/
.cache-loader/

# Static site generators
_site/
.jekyll-cache/
.jekyll-metadata
.hugo_build.lock

# Serverless architectures
.serverless/
.aws-sam/
.sst/

# Service integrations
.firebase/
.amplify/
.sentryclirc
.contentful.json

# Misc files
*.swp
*.swo
*.swn
*.bak
*.tmp
*.temp
*~
.svn/
CVS/
.hg/
.fuse_hidden*
.directory
.nfs*
._*
.Trash-*

# Package specific
.rollup.cache/
tsconfig.tsbuildinfo
.eslintcache
.stylelintcache
.prettiercache
.webpack/
.turbo
.svelte-kit

# Local dev tools
.nodemon-debug
.clinic/
.depcruise.cache

# Documentation
/docs/_build/
/site/

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# TypeScript incremental compilation cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# macOS
.AppleDouble
.LSOverride
Icon
Network Trash Folder
Temporary Items

# Windows
$RECYCLE.BIN/
System Volume Information
`;
async function checkForExistingGitignore() {
    try {
        await fs.access(".gitignore");
        return true;
    }
    catch {
        return false;
    }
}
async function createGitignore() {
    await fs.writeFile(".gitignore", DEFAULT_GITIGNORE_CONTENT, "utf-8");
}

async function setupVSCodeConfig(features) {
    const vscodeSettingsPath = path.resolve(process.cwd(), ".vscode", "settings.json");
    let settings = {};
    try {
        const existingSettings = await fs.readFile(vscodeSettingsPath, "utf8");
        settings = JSON.parse(existingSettings);
    }
    catch {
        // File does not exist
    }
    const languages = new Set();
    if (features.includes("javascript")) {
        languages.add("javascript");
        languages.add("javascriptreact");
    }
    if (features.includes("typescript")) {
        languages.add("typescript");
        languages.add("typescriptreact");
    }
    if (features.includes("json")) {
        languages.add("json");
        languages.add("jsonc");
    }
    if (features.includes("yaml")) {
        languages.add("yaml");
        languages.add("yml");
    }
    if (features.includes("react")) {
        languages.add("javascriptreact");
        languages.add("typescriptreact");
    }
    settings["eslint.validate"] = [...languages].map((language) => ({
        autoFix: true,
        language,
    }));
    settings["editor.codeActionsOnSave"] = {
        "source.fixAll.eslint": true,
    };
    await fs.mkdir(path.dirname(vscodeSettingsPath), { recursive: true });
    // eslint-disable-next-line @elsikora-typescript/no-magic-numbers
    await fs.writeFile(vscodeSettingsPath, JSON.stringify(settings, null, 2), "utf-8");
}
async function setupWebStormConfig(features, includePrettier = false) {
    const webstormConfigPath = path.resolve(process.cwd(), ".idea", "jsLinters", "eslint.xml");
    const extensions = new Set(["cjs", "cts", "html", "js", "json", "jsx", "mjs", "mts", "ts", "tsx", "vue", "yaml", "yml"]);
    if (!features.includes("react")) {
        extensions.delete("jsx");
        extensions.delete("tsx");
    }
    if (!features.includes("typescript")) {
        extensions.delete("ts");
        extensions.delete("cts");
        extensions.delete("mts");
    }
    if (!features.includes("json")) {
        extensions.delete("json");
    }
    if (!features.includes("yaml")) {
        extensions.delete("yaml");
        extensions.delete("yml");
    }
    const filesPattern = `**/*.{${[...extensions].join(",")}}`;
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="EslintConfiguration">
    <option name="configurationDirPath" value="$PROJECT_DIR$" />
    <option name="additionalConfig" value="--fix" />
    <files-pattern value="${filesPattern}" />
  </component>
</project>
`;
    await fs.mkdir(path.dirname(webstormConfigPath), { recursive: true });
    await fs.writeFile(webstormConfigPath, xmlContent, "utf-8");
    if (includePrettier) {
        const webstormPrettierConfigPath = path.resolve(process.cwd(), ".idea", "prettier.xml");
        const prettierXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="PrettierConfiguration">
    <option name="myConfigurationMode" value="AUTOMATIC" />
  </component>
</project>
`;
        await fs.mkdir(path.dirname(webstormPrettierConfigPath), {
            recursive: true,
        });
        await fs.writeFile(webstormPrettierConfigPath, prettierXmlContent, "utf-8");
    }
}

async function checkForExistingLicense() {
    const commonLicenseFiles = ["LICENSE", "LICENSE.txt", "LICENSE.md", "license", "license.txt", "license.md", "COPYING", "COPYING.txt", "COPYING.md"];
    try {
        for (const file of commonLicenseFiles) {
            try {
                const filePath = path.resolve(process.cwd(), file);
                await fs.access(filePath);
                return { exists: true, path: file };
            }
            catch { }
        }
        return { exists: false };
    }
    catch {
        return { exists: false };
    }
}
async function createLicense(licenseType) {
    const config = LICENSE_CONFIGS[licenseType];
    if (!config) {
        throw new Error(`Unsupported license type: ${licenseType}`);
    }
    const year = new Date().getFullYear().toString();
    const author = await getAuthorFromPackageJson();
    const licenseContent = config.template(year, author);
    await fs.writeFile("LICENSE", licenseContent, "utf-8");
}
async function getAuthorFromPackageJson() {
    try {
        const packageJsonPath = path.resolve(process.cwd(), "package.json");
        const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
        const packageJson = JSON.parse(packageJsonContent);
        if (packageJson.author) {
            if (typeof packageJson.author === "string") {
                return packageJson.author;
            }
            if (typeof packageJson.author === "object" && packageJson.author.name) {
                return packageJson.author.name;
            }
        }
        return "";
    }
    catch {
        return "";
    }
}
function getLicenseChoices() {
    return Object.entries(LICENSE_CONFIGS).map(([key, config]) => ({
        name: `${config.name} - ${config.description}`,
        value: key,
    }));
}

const exec$2 = promisify(exec$3);
async function checkConfigInstalled() {
    try {
        const { stdout } = await exec$2("npm ls @elsikora/eslint-config --all --depth=0 --json");
        // eslint-disable-next-line @elsikora-typescript/typedef
        const npmList = JSON.parse(stdout);
        const configVersion = npmList.dependencies?.["@elsikora/eslint-config"]?.version || npmList.devDependencies?.["@elsikora/eslint-config"]?.version || null;
        return { isInstalled: !!configVersion, version: configVersion };
    }
    catch {
        return { isInstalled: false, version: null };
    }
}
async function checkEslintInstalled() {
    try {
        const { stdout } = await exec$2("npm ls eslint --all --depth=0 --json");
        const npmList = JSON.parse(stdout);
        const eslintVersion = npmList.dependencies?.eslint?.version || npmList.devDependencies?.eslint?.version || null;
        return { isInstalled: !!eslintVersion, version: eslintVersion };
    }
    catch {
        return { isInstalled: false, version: null };
    }
}
async function detectInstalledFeatures() {
    try {
        const packageJsonPath = path.resolve(process.cwd(), "package.json");
        const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
        const packageJson = JSON.parse(packageJsonContent);
        const allDependencies = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
        };
        const detectedFeatures = new Set();
        for (const [feature, config] of Object.entries(FEATURES_CONFIG)) {
            if (config.required) {
                detectedFeatures.add(feature);
            }
        }
        for (const [feature, config] of Object.entries(FEATURES_CONFIG)) {
            if (config.detect) {
                // @ts-ignore
                const isDetected = config.detect.some((package_) => !!allDependencies[package_]);
                if (isDetected) {
                    detectedFeatures.add(feature);
                }
            }
        }
        return [...detectedFeatures];
    }
    catch {
        return ["javascript"];
    }
}
async function detectTypescriptInProject() {
    try {
        const packageJsonPath = path.resolve(process.cwd(), "package.json");
        const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
        const packageJson = JSON.parse(packageJsonContent);
        const allDependencies = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
        };
        // @ts-ignore
        return !!(allDependencies.typescript || allDependencies["@types/node"]);
    }
    catch {
        return false;
    }
}
async function installDependencies(features) {
    const depsToInstall = new Set(CORE_DEPENDENCIES);
    for (const feature of features) {
        const config = FEATURES_CONFIG[feature];
        if (config?.packages) {
            config.packages.forEach((package_) => depsToInstall.add(package_));
        }
    }
    const depsArray = [...depsToInstall];
    await exec$2(`npm install -D ${depsArray.join(" ")}`);
}
async function validateFeatureSelection(features) {
    const hasTypescript = await detectTypescriptInProject();
    const errors = [];
    for (const feature of features) {
        const config = FEATURES_CONFIG[feature];
        if (config.requiresTypescript && !hasTypescript) {
            errors.push(`${feature} requires TypeScript, but TypeScript is not detected in your project. Please install TypeScript first.`);
        }
    }
    return {
        errors,
        isValid: errors.length === 0,
    };
}

const exec$1 = promisify(exec$3);
async function createStylelintConfig() {
    const stylelintConfigContent = `
export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-rational-order',
    'stylelint-prettier/recommended',
    'stylelint-config-css-modules',
  ],
  plugins: [
    'stylelint-order',
    'stylelint-config-rational-order/plugin',
    'stylelint-prettier',
  ],
  defaultSeverity: 'warning',
};
`;
    await fs.writeFile("stylelint.config.js", stylelintConfigContent, "utf-8");
    const stylelintIgnoreContent = `node_modules
dist
build
`;
    await fs.writeFile(".stylelintignore", stylelintIgnoreContent, "utf-8");
}
async function installStylelintDependencies() {
    const stylelintDeps = ["stylelint@^16.10.0", "stylelint-config-css-modules@^4.4.0", "stylelint-config-rational-order@^0.1.2", "stylelint-config-standard-scss@^13.1.0", "stylelint-order@^6.0.4", "stylelint-prettier@^5.0.2"];
    await exec$1(`npm install -D ${stylelintDeps.join(" ")}`);
}

async function findExistingFiles(files) {
    const fileChecks = files.map(async (file) => {
        try {
            await fs.access(file);
            return file;
        }
        catch {
            // File does not exist
            return null;
        }
    });
    const existingFiles = (await Promise.all(fileChecks)).filter(Boolean);
    return existingFiles;
}

const exec = promisify(exec$3);
async function runCli() {
    console.clear();
    intro(color.cyan("ESLint Configuration Setup (@elsikora/eslint-config)"));
    const { isInstalled: hasEslint, version: eslintVersion, } = await checkEslintInstalled();
    const { isInstalled: hasConfig } = await checkConfigInstalled();
    if (hasConfig) {
        const shouldUninstallOldConfig = await confirm({
            initialValue: true,
            message: "An existing ElsiKora ESLint configuration is detected. Would you like to uninstall it?",
        });
        if (!shouldUninstallOldConfig) {
            outro(color.red("Existing ElsiKora ESLint configuration detected. Setup aborted."));
            process.exit(1);
        }
        const uninstallSpinner = spinner();
        uninstallSpinner.start("Uninstalling existing ElsiKora ESLint configuration...");
        try {
            await exec("npm uninstall @elsikora/eslint-config eslint");
            uninstallSpinner.stop("Existing ESLint configuration uninstalled successfully!");
            // Check for existing ESLint config files
            const existingEslintConfigFiles = await findExistingFiles(ESLINT_CONFIG_FILES);
            const hasEslintConfigInPackageJson = await checkForEslintConfigInPackageJson();
            if (existingEslintConfigFiles.length > 0 || hasEslintConfigInPackageJson) {
                const filesList = existingEslintConfigFiles.join("\n- ");
                const messageLines = ["Existing ESLint configuration files detected:"];
                messageLines.push("");
                if (filesList) {
                    messageLines.push("- " + filesList);
                }
                if (hasEslintConfigInPackageJson) {
                    messageLines.push("- package.json (eslintConfig field)");
                }
                messageLines.push("", "Do you want to delete them?");
                const shouldDeleteConfigFiles = await confirm({
                    initialValue: true,
                    message: messageLines.join("\n"),
                });
                if (shouldDeleteConfigFiles) {
                    // Delete the files
                    await Promise.all(existingEslintConfigFiles.map((file) => fs.unlink(file)));
                    // Also remove 'eslintConfig' field from package.json
                    await removeEslintConfigFromPackageJson();
                }
            }
        }
        catch (error) {
            uninstallSpinner.stop("Failed to uninstall existing ESLint configuration");
            throw error;
        }
    }
    if (hasEslint && eslintVersion) {
        const majorVersion = Number.parseInt(eslintVersion.split(".")[0], 10);
        // eslint-disable-next-line @elsikora-typescript/no-magic-numbers
        if (majorVersion < 9) {
            const shouldUninstallOldEslint = await confirm({
                initialValue: true,
                message: `ESLint version ${eslintVersion} is installed, which is incompatible with this configuration.` + "\nWould you like to uninstall it and install a compatible version?",
            });
            if (!shouldUninstallOldEslint) {
                outro(color.red("Incompatible ESLint version detected. Setup aborted."));
                process.exit(1);
            }
            const uninstallSpinner = spinner();
            uninstallSpinner.start("Uninstalling old ESLint version...");
            try {
                await exec("npm uninstall eslint");
                uninstallSpinner.stop("Old ESLint version uninstalled successfully!");
            }
            catch (error) {
                uninstallSpinner.stop("Failed to uninstall old ESLint version");
                throw error;
            }
        }
    }
    const detectedFeatures = await detectInstalledFeatures();
    let shouldUseDetected = false;
    if (detectedFeatures.length > 1) {
        shouldUseDetected = await confirm({
            initialValue: true,
            message: `Detected: ${detectedFeatures.join(", ")}. Would you like to include these features?`,
        });
    }
    const selectOptions = [];
    const hasTypescript = await detectTypescriptInProject();
    for (const [groupName, features] of Object.entries(FEATURE_GROUPS)) {
        selectOptions.push(new inquirer.Separator(`\n=== ${groupName} ===`));
        for (const feature of features) {
            const config = FEATURES_CONFIG[feature];
            selectOptions.push({
                checked: feature === "javascript" || (shouldUseDetected && detectedFeatures.includes(feature)),
                disabled: feature === "javascript" ? "Required" : config.requiresTypescript && !hasTypescript ? "Requires TypeScript" : false,
                name: `${feature} - ${config.description}`,
                value: feature,
            });
        }
    }
    const answers = await inquirer.prompt([
        {
            choices: selectOptions,
            message: "Select the features you want to enable:",
            name: "selectedFeatures",
            // eslint-disable-next-line @elsikora-typescript/no-magic-numbers
            pageSize: 15,
            type: "checkbox",
            // eslint-disable-next-line @elsikora-typescript/explicit-function-return-type,@elsikora-typescript/typedef
            validate(answer) {
                if (answer.length === 0) {
                    return "You must choose at least one feature.";
                }
                return true;
            },
        },
    ]);
    const selectedFeatures = answers.selectedFeatures;
    if (!selectedFeatures || selectedFeatures.length === 0) {
        outro(color.red("No features selected. Configuration aborted."));
        process.exit(1);
    }
    if (!selectedFeatures.includes("javascript")) {
        selectedFeatures.unshift("javascript");
    }
    const { errors, isValid, } = await validateFeatureSelection(selectedFeatures);
    if (!isValid) {
        outro(color.red("Configuration cannot proceed due to the following errors:"));
        errors.forEach((error) => {
            console.error(color.red(`- ${error}`));
        });
        process.exit(1);
    }
    const setupSpinner = spinner();
    try {
        // Start the spinner for ESLint configuration
        setupSpinner.start("Setting up ESLint configuration...");
        const configExtension = await getConfigFileExtension();
        const { framework, } = await detectProjectStructure();
        if (framework) {
            note([`Detected ${framework.framework.name} project structure.`, `Will configure linting for the following paths:`, ...framework.framework.lintPaths.map((path) => `  - ${path}`), "", "Additional ignore patterns will be added to the configuration."].join("\n"), "Framework Detection");
        }
        await installDependencies(selectOptions.map((option) => option.value));
        await createEslintConfig(selectedFeatures, configExtension, framework);
        // Stop the spinner before the Stylelint prompt
        setupSpinner.stop("ESLint configuration completed successfully!");
        note(["ESLint configuration has been created.", "", "Available files:", `- eslint.config${configExtension}`, "- .eslintignore", "", "You can customize the configuration in these files."].join("\n"), "ESLint Setup");
        const installStylelint = await confirm({
            initialValue: true,
            message: "Would you like to set up Stylelint for your project?",
        });
        if (installStylelint) {
            const existingStylelintConfigFiles = await findExistingFiles(STYLELINT_CONFIG_FILES);
            const hasStylelintConfigInPackageJson = await checkForStylelintConfigInPackageJson();
            if (existingStylelintConfigFiles.length > 0 || hasStylelintConfigInPackageJson) {
                const filesList = existingStylelintConfigFiles.join("\n- ");
                const messageLines = ["Existing Stylelint configuration files detected:"];
                messageLines.push("");
                if (filesList) {
                    messageLines.push("- " + filesList);
                }
                if (hasStylelintConfigInPackageJson) {
                    messageLines.push("- package.json (stylelint field)");
                }
                messageLines.push("", "Do you want to delete them?");
                const shouldDeleteStylelintConfigFiles = await confirm({
                    initialValue: true,
                    message: messageLines.join("\n"),
                });
                if (shouldDeleteStylelintConfigFiles) {
                    await Promise.all(existingStylelintConfigFiles.map((file) => fs.unlink(file)));
                    await removeStylelintConfigFromPackageJson();
                }
            }
            // Добавляем установку и создание конфигурации Stylelint
            setupSpinner.start("Setting up Stylelint configuration...");
            try {
                await installStylelintDependencies();
                await createStylelintConfig();
                setupSpinner.stop("Stylelint configuration completed successfully!");
                note(["Stylelint configuration has been created.", "", "Available files:", "- stylelint.config.js", "- .stylelintignore", "", "You can customize the configuration in these files."].join("\n"), "Stylelint Setup");
            }
            catch (error) {
                setupSpinner.stop("Failed to set up Stylelint configuration");
                throw error;
            }
        }
        if (selectedFeatures.includes("prettier")) {
            // Check for existing Prettier config files
            const existingPrettierConfigFiles = await findExistingFiles(PRETTIER_CONFIG_FILES);
            const hasPrettierConfigInPackageJson = await checkForPrettierConfigInPackageJson();
            if (existingPrettierConfigFiles.length > 0 || hasPrettierConfigInPackageJson) {
                const filesList = existingPrettierConfigFiles.join("\n- ");
                const messageLines = ["Existing Prettier configuration files detected:"];
                messageLines.push("");
                if (filesList) {
                    messageLines.push("- " + filesList);
                }
                if (hasPrettierConfigInPackageJson) {
                    messageLines.push("- package.json (prettier field)");
                }
                messageLines.push("", "Do you want to delete them?");
                const shouldDeletePrettierConfigFiles = await confirm({
                    initialValue: true,
                    message: messageLines.join("\n"),
                });
                if (shouldDeletePrettierConfigFiles) {
                    // Delete the files
                    await Promise.all(existingPrettierConfigFiles.map((file) => fs.unlink(file)));
                    // Also remove 'prettier' field from package.json
                    await removePrettierConfigFromPackageJson();
                }
            }
            setupSpinner.start("Setting up Prettier configuration...");
            await createPrettierConfig(configExtension);
            setupSpinner.stop("Prettier configuration completed successfully!");
            note(["Prettier configuration has been created.", "", "Available files:", `- prettier.config${configExtension}`, "- .prettierignore", "", "You can customize the configuration in these files."].join("\n"), "Prettier Setup");
        }
        // Continue with the rest of your script...
        const setupIdeConfigs = await confirm({
            initialValue: true,
            message: "Would you like to set up ESLint configurations for your code editor (e.g., VSCode, WebStorm)?",
        });
        if (setupIdeConfigs) {
            const ideAnswers = await inquirer.prompt([
                {
                    choices: [
                        { name: "VSCode", value: "vscode" },
                        { name: "WebStorm (IntelliJ IDEA)", value: "webstorm" },
                    ],
                    message: "Select your code editor(s):",
                    name: "selectedIDEs",
                    type: "checkbox",
                    // eslint-disable-next-line @elsikora-typescript/explicit-function-return-type
                    validate(answer) {
                        if (answer.length === 0) {
                            return "You must choose at least one code editor.";
                        }
                        return true;
                    },
                },
            ]);
            const selectedIDEs = ideAnswers.selectedIDEs;
            if (selectedIDEs.includes("vscode")) {
                await setupVSCodeConfig(selectedFeatures);
            }
            if (selectedIDEs.includes("webstorm")) {
                await setupWebStormConfig(selectedFeatures, selectedFeatures.includes("prettier"));
            }
        }
        const setupGitHubCIResponse = await confirm({
            // eslint-disable-next-line @elsikora-typescript/naming-convention
            initialValue: true,
            message: "Would you like to set up GitHub CI workflows?",
        });
        const willSetupGitHubCI = setupGitHubCIResponse === true;
        let ciAnswers;
        const isNpmPackage = false;
        if (willSetupGitHubCI) {
            const isNpmPackageResponse = await confirm({
                initialValue: false,
                message: "Is this package going to be published to NPM?",
            });
            const isNpmPackage = isNpmPackageResponse === true;
            ciAnswers = await inquirer.prompt([
                {
                    choices: Object.entries(GITHUB_CI_FILES).map(([key, value]) => ({
                        name: `${value.name} - ${value.description}`,
                        value: key,
                    })),
                    message: "Select the CI workflows you want to set up:",
                    name: "selectedCIFiles",
                    pageSize: 10,
                    type: "checkbox",
                },
            ]);
            if (ciAnswers.selectedCIFiles.length > 0) {
                // If dependabot is selected, ask for target branch
                let dependabotBranch = "dev";
                if (ciAnswers.selectedCIFiles.includes("DEPENDABOT")) {
                    const branchAnswer = await inquirer.prompt([
                        {
                            default: "dev",
                            message: "Enter the target branch for Dependabot updates:",
                            name: "branch",
                            type: "input",
                        },
                    ]);
                    dependabotBranch = branchAnswer.branch;
                }
                setupSpinner.start("Setting up GitHub CI configuration...");
                await setupGitHubCIConfig(ciAnswers.selectedCIFiles, isNpmPackage, dependabotBranch);
                setupSpinner.stop("GitHub CI configuration completed successfully!");
                // @ts-ignore
                const selectedFileNames = ciAnswers.selectedCIFiles.map((file) => GITHUB_CI_FILES[file].name);
                note(["GitHub CI configuration has been created.", "", "", "Created files:", ...selectedFileNames.map((name) => `- ${name}`), "", "", dependabotBranch !== "dev" && ciAnswers.selectedCIFiles.includes("DEPENDABOT") ? `Dependabot configured to target '${dependabotBranch}' branch` : `Dependabot configured to target 'dev' branch`, "", "", "The workflows will be activated when you push to GitHub."].filter(Boolean).join("\n"), "GitHub CI Setup");
            }
        }
        const setupChangesets = await confirm({
            initialValue: true,
            message: "Would you like to set up Changesets for version management?",
        });
        if (setupChangesets) {
            setupSpinner.start("Setting up Changesets configuration...");
            try {
                // Install changesets
                await exec("npm install -D @changesets/cli");
                // Create .changeset directory and config
                await fs.mkdir(".changeset", { recursive: true });
                await fs.writeFile(".changeset/config.json", `{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}`);
                const packageJsonPath = path.resolve(process.cwd(), "package.json");
                const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
                const packageJson = JSON.parse(packageJsonContent);
                packageJson.scripts = {
                    ...packageJson.scripts,
                    patch: "changeset",
                    release: "npm install && npm run build && changeset publish",
                };
                await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
                setupSpinner.stop("Changesets configuration completed successfully!");
                note(["Changesets has been configured for your project.", "", "Available commands:", "  npm run patch     # create a new changeset", "  npm run release   # publish packages", "", "Configuration file:", "  .changeset/config.js"].join("\n"), "Changesets Setup");
            }
            catch (error) {
                setupSpinner.stop("Failed to set up Changesets configuration");
                throw error;
            }
        }
        const hasGitignore = await checkForExistingGitignore();
        let shouldSetupGitignore = true;
        if (hasGitignore) {
            const shouldDeleteGitignore = await confirm({
                initialValue: true,
                message: "An existing .gitignore file was found. Would you like to replace it?",
            });
            if (shouldDeleteGitignore) {
                try {
                    await fs.unlink(".gitignore");
                }
                catch (error) {
                    console.error("Error deleting existing .gitignore:", error);
                    throw error;
                }
            }
            else {
                shouldSetupGitignore = false;
            }
        }
        if (shouldSetupGitignore) {
            setupSpinner.start("Setting up .gitignore...");
            try {
                await createGitignore();
                setupSpinner.stop(".gitignore created successfully!");
                note([".gitignore has been configured for your project.", "", "The configuration includes ignore patterns for:", "- Build outputs and dependencies", "- Common IDEs and editors", "- Testing and coverage files", "- Environment and local config files", "- System and temporary files", "- Framework-specific files", "- Lock files", "", "You can customize it further by editing .gitignore"].join("\n"), "Gitignore Setup");
            }
            catch (error) {
                setupSpinner.stop("Failed to create .gitignore");
                throw error;
            }
        }
        const setupLicense = await confirm({
            initialValue: true,
            message: "Would you like to set up a LICENSE file for your project?",
        });
        if (setupLicense) {
            const { exists: hasExistingLicense, path: existingLicensePath } = await checkForExistingLicense();
            if (hasExistingLicense) {
                const shouldReplaceLicense = await confirm({
                    initialValue: false,
                    message: `An existing license file was found (${existingLicensePath}). Would you like to replace it?`,
                });
                if (!shouldReplaceLicense) {
                    note("Keeping existing license file.", "License Setup");
                    return;
                }
                try {
                    if (existingLicensePath) {
                        await fs.unlink(existingLicensePath);
                    }
                }
                catch (error) {
                    console.error("Error deleting existing license:", error);
                    throw error;
                }
            }
            const licenseAnswer = await inquirer.prompt([
                {
                    choices: getLicenseChoices(),
                    message: "Select a license for your project:",
                    name: "selectedLicense",
                    type: "list",
                },
            ]);
            setupSpinner.start("Creating LICENSE file...");
            try {
                await createLicense(licenseAnswer.selectedLicense);
                setupSpinner.stop("LICENSE file created successfully!");
                note(["LICENSE file has been created.", "", "The license has been customized with:", `- Current year: ${new Date().getFullYear()}`, `- Author: ${(await getAuthorFromPackageJson()) || "(Not found in package.json)"}`, `- Type: ${LICENSE_CONFIGS[licenseAnswer.selectedLicense].name}`].join("\n"), "License Setup");
            }
            catch (error) {
                setupSpinner.stop("Failed to create LICENSE file");
                throw error;
            }
        }
        try {
            const { customPaths, framework, } = await detectProjectStructure();
            if (framework) {
                note([`Detected ${framework.framework.name} project structure.`, "Will configure linting for:", ...framework.framework.lintPaths.map((path) => `  - ${path}`)].join("\n"), "Framework Detection");
            }
            await updatePackageJson(framework, customPaths, selectedFeatures.includes("prettier"), installStylelint);
            const scriptDescriptions = [];
            // Basic lint commands
            scriptDescriptions.push("Available commands:", "  npm run lint      # check for ESLint issues", "  npm run lint:fix  # automatically fix ESLint issues");
            // Framework-specific commands
            if (framework) {
                if (framework.hasTypescript) {
                    scriptDescriptions.push("  npm run lint:types # check TypeScript types", "  npm run lint:all   # run all checks (ESLint + TypeScript)");
                }
                switch (framework.framework.name) {
                    case "angular": {
                        scriptDescriptions.push("  npm run lint:test  # lint test files");
                        break;
                    }
                    case "express":
                    case "fastify":
                    case "koa":
                    case "next": {
                        scriptDescriptions.push("  npm run lint:watch # watch mode: lint files on change");
                        break;
                    }
                    case "nest": {
                        scriptDescriptions.push("  npm run lint:watch # watch mode: lint files on change", "  npm run lint:test  # lint test files");
                        break;
                    }
                }
            }
            // Stylelint commands
            if (installStylelint) {
                scriptDescriptions.push("", "Stylelint commands:", "  npm run lint      # includes CSS/SCSS linting", "  npm run lint:fix  # includes CSS/SCSS auto-fixing");
            }
            // Prettier commands
            if (selectedFeatures.includes("prettier")) {
                scriptDescriptions.push("", "Prettier commands:", "  npm run format     # check code formatting", "  npm run format:fix # automatically format code");
            }
            if (willSetupGitHubCI) {
                scriptDescriptions.push("", "GitHub CI Workflows:");
                // Map the selected CI files to their descriptions
                ciAnswers.selectedCIFiles.forEach((file) => {
                    scriptDescriptions.push(`  ${GITHUB_CI_FILES[file].name} - ${GITHUB_CI_FILES[file].description}`);
                });
                if (isNpmPackage) ;
            }
            if (setupChangesets) {
                scriptDescriptions.push("", "Changesets commands:", "  npm run patch      # create a new changeset", "  npm run release    # publish packages");
            }
            if (shouldSetupGitignore) {
                scriptDescriptions.push("", "Git configuration:", "  .gitignore has been configured with common ignore patterns", "  Including patterns for:", "    - Build outputs and dependencies", "    - IDE and editor files", "    - Testing and coverage", "    - Environment files", "    - Framework specific ignores");
            }
            if (framework) {
                note(["ESLint has been configured for your project.", `Framework: ${framework.framework.name}`, framework.hasTypescript ? "TypeScript support: enabled" : "", "", ...scriptDescriptions].filter(Boolean).join("\n"), "Configuration Summary");
            }
            else {
                note(["ESLint has been configured for your project.", `Linting paths: ${customPaths.join(", ")}`, "", ...scriptDescriptions].join("\n"), "Configuration Summary");
            }
            outro(color.green("✨ All done! Happy coding!"));
        }
        catch (error) {
            setupSpinner.stop("Failed to set up ESLint configuration");
            outro(color.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
            process.exit(1);
        }
    }
    catch (error) {
        setupSpinner.stop("Failed to set up ESLint configuration");
        outro(color.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
    }
}

// eslint-disable-next-line @elsikora-typescript/no-empty-function
await runCli().then(() => { });
