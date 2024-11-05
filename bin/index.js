#!/usr/bin/env node
import { exec as exec$3 } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import inquirer from 'inquirer';
import { intro, confirm, outro, spinner, note } from '@clack/prompts';
import color from 'picocolors';
import path from 'node:path';

const FEATURES_CONFIG = {
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
};
const FEATURE_GROUPS = {
    "Core Features": ["javascript", "typescript"],
    Frameworks: ["react", "nest"],
    Styling: ["tailwindCss", "prettier", "stylistic"],
    "Code Quality": ["sonar", "unicorn", "perfectionist"],
    "File Types": ["json", "yaml", "checkFile", "packageJson"],
    "Other Tools": ["node", "regexp", "typeorm"],
};
const ESLINT_CONFIG_FILES = ["eslint.config.js", "eslint.config.cjs", "eslint.config.mjs", ".eslintrc.js", ".eslintrc.cjs", ".eslintrc.yaml", ".eslintrc.yml", ".eslintrc.json", ".eslintrc", ".eslintignore"];
const PRETTIER_CONFIG_FILES = ["prettier.config.js", "prettier.config.cjs", "prettier.config.mjs", ".prettierrc", ".prettierrc.js", ".prettierrc.cjs", ".prettierrc.json", ".prettierrc.yaml", ".prettierrc.yml", ".prettierignore"];
const STYLELINT_CONFIG_FILES = ["stylelint.config.js", "stylelint.config.cjs", "stylelint.config.mjs", ".stylelintrc", ".stylelintrc.js", ".stylelintrc.cjs", ".stylelintrc.json", ".stylelintrc.yaml", ".stylelintrc.yml", ".stylelintignore"];
const CORE_DEPENDENCIES = ["@elsikora/eslint-config", "@eslint/js", "@eslint/compat", "@types/eslint__js"];

const exec$2 = promisify(exec$3);
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
        isValid: errors.length === 0,
        errors,
    };
}
async function checkEslintInstalled() {
    try {
        // eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
        const { stdout } = await exec$2("npm ls eslint --all --depth=0 --json");
        // eslint-disable-next-line @elsikora-typescript/no-unsafe-argument,@elsikora-typescript/no-unsafe-assignment
        const npmList = JSON.parse(stdout);
        // eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment,@elsikora-typescript/no-unsafe-member-access
        const eslintVersion = npmList.dependencies?.eslint?.version || npmList.devDependencies?.eslint?.version || null;
        return { isInstalled: !!eslintVersion, version: eslintVersion };
    }
    catch {
        return { isInstalled: false, version: null };
    }
}
async function checkConfigInstalled() {
    try {
        // eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
        const { stdout } = await exec$2("npm ls @elsikora/eslint-config --all --depth=0 --json");
        // eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment,@elsikora-typescript/typedef,@elsikora-typescript/no-unsafe-argument
        const npmList = JSON.parse(stdout);
        // eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment,@elsikora-typescript/no-unsafe-member-access
        const configVersion = npmList.dependencies?.["@elsikora/eslint-config"]?.version || npmList.devDependencies?.["@elsikora/eslint-config"]?.version || null;
        return { isInstalled: !!configVersion, version: configVersion };
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
        // eslint-disable-next-line @elsikora-typescript/no-unused-vars
        const allDependencies = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
        };
        const detectedFeatures = new Set();
        // eslint-disable-next-line @elsikora-typescript/typedef
        Object.entries(FEATURES_CONFIG).forEach(([feature, config]) => {
            if (config.required) {
                detectedFeatures.add(feature);
            }
        });
        // eslint-disable-next-line @elsikora-typescript/typedef
        Object.entries(FEATURES_CONFIG).forEach(([feature, config]) => {
            if (config.detect) {
                // @ts-ignore
                const isDetected = config.detect.some((pkg) => !!allDependencies[pkg]);
                if (isDetected) {
                    detectedFeatures.add(feature);
                }
            }
        });
        return Array.from(detectedFeatures);
    }
    catch {
        return ["javascript"];
    }
}
async function installDependencies(features) {
    const depsToInstall = new Set(CORE_DEPENDENCIES);
    for (const feature of features) {
        const config = FEATURES_CONFIG[feature];
        if (config?.packages) {
            config.packages.forEach((pkg) => depsToInstall.add(pkg));
        }
    }
    const depsArray = [...depsToInstall];
    await exec$2(`npm install -D ${depsArray.join(" ")}`);
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

const FRAMEWORK_CONFIGS = [
    {
        name: "next",
        packageIndicators: ["next"],
        lintPaths: ["./src/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
        ignorePaths: {
            directories: [".next/", "out/"],
            patterns: ["next-env.d.ts", "next.config.js", "next.config.mjs", "**/node_modules/**/*", "**/.git/**/*"],
        },
    },
    {
        name: "remix",
        packageIndicators: ["@remix-run/react", "@remix-run/node"],
        lintPaths: ["./app/**/*.{js,jsx,ts,tsx}"],
        ignorePaths: {
            directories: [".cache/", "build/", "public/build/"],
            patterns: ["remix.config.js", "remix.config.ts", "**/node_modules/**/*", "**/.git/**/*"],
        },
    },
    {
        name: "gatsby",
        packageIndicators: ["gatsby"],
        lintPaths: ["./src/**/*.{js,jsx,ts,tsx}", "./gatsby-*.{js,ts}"],
        ignorePaths: {
            directories: [".cache/", "public/"],
            patterns: ["gatsby-*.js", "gatsby-*.ts", "**/node_modules/**/*", "**/.git/**/*"],
        },
    },
    {
        name: "vue",
        packageIndicators: ["vue", "nuxt", "@nuxt/core"],
        lintPaths: ["./src/**/*.{js,ts,vue}", "./components/**/*.{js,ts,vue}", "./pages/**/*.{js,ts,vue}"],
        ignorePaths: {
            directories: ["dist/", ".nuxt/", ".output/"],
            patterns: ["*.config.{js,ts}", "*.config.*.{js,ts}", "**/node_modules/**/*", "**/.git/**/*"],
        },
    },
    {
        name: "angular",
        packageIndicators: ["@angular/core"],
        fileIndicators: ["angular.json"],
        lintPaths: ["./src/**/*.{js,ts}", "./projects/**/*.{js,ts}"],
        ignorePaths: {
            directories: ["dist/", ".angular/", "coverage/"],
            patterns: ["*.spec.ts", "*.conf.js", "e2e/**/*", "**/node_modules/**/*", "**/.git/**/*"],
        },
    },
    {
        name: "nest",
        packageIndicators: ["@nestjs/core", "@nestjs/common"],
        lintPaths: ["./src/**/*.ts", "./libs/**/*.ts", "./apps/**/*.ts"],
        ignorePaths: {
            directories: ["dist/", "coverage/", ".nest/"],
            patterns: ["*.spec.ts", "test/**/*", "**/node_modules/**/*", "**/.git/**/*", "nest-cli.json"],
        },
    },
    {
        name: "express",
        packageIndicators: ["express"],
        lintPaths: ["./src/**/*.{js,ts}", "./routes/**/*.{js,ts}", "./api/**/*.{js,ts}", "./middleware/**/*.{js,ts}"],
        ignorePaths: {
            directories: ["dist/", "build/"],
            patterns: ["*.test.{js,ts}", "*.spec.{js,ts}", "**/node_modules/**/*", "**/.git/**/*"],
        },
    },
    {
        name: "koa",
        packageIndicators: ["koa"],
        lintPaths: ["./src/**/*.{js,ts}", "./routes/**/*.{js,ts}", "./api/**/*.{js,ts}", "./middleware/**/*.{js,ts}"],
        ignorePaths: {
            directories: ["dist/", "build/"],
            patterns: ["*.test.{js,ts}", "*.spec.{js,ts}", "**/node_modules/**/*", "**/.git/**/*"],
        },
    },
    {
        name: "fastify",
        packageIndicators: ["fastify"],
        lintPaths: ["./src/**/*.{js,ts}", "./routes/**/*.{js,ts}", "./plugins/**/*.{js,ts}", "./services/**/*.{js,ts}"],
        ignorePaths: {
            directories: ["dist/", "build/"],
            patterns: ["*.test.{js,ts}", "*.spec.{js,ts}", "**/node_modules/**/*", "**/.git/**/*"],
        },
    },
    {
        name: "astro",
        packageIndicators: ["astro"],
        lintPaths: ["./src/**/*.{js,ts,astro}", "./pages/**/*.{js,ts,astro}", "./components/**/*.{js,ts,astro}"],
        ignorePaths: {
            directories: ["dist/", ".astro/"],
            patterns: ["astro.config.mjs", "**/node_modules/**/*", "**/.git/**/*"],
        },
    },
    {
        name: "svelte",
        packageIndicators: ["svelte", "@sveltejs/kit"],
        lintPaths: ["./src/**/*.{js,ts,svelte}", "./routes/**/*.{js,ts,svelte}"],
        ignorePaths: {
            directories: ["build/", ".svelte-kit/"],
            patterns: ["svelte.config.js", "vite.config.js", "**/node_modules/**/*", "**/.git/**/*"],
        },
    },
];
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
async function detectSourceDirectory() {
    const commonDirs = ["src", "app", "source", "lib"];
    const existingDirs = [];
    for (const dir of commonDirs) {
        // eslint-disable-next-line no-await-in-loop
        if (await fileExists(dir)) {
            existingDirs.push(dir);
        }
    }
    return existingDirs;
}
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
            const hasPackageIndicators = config.packageIndicators.some((pkg) => !!allDependencies[pkg]);
            if (hasPackageIndicators) {
                // If there are file indicators, check them too
                if (config.fileIndicators) {
                    // eslint-disable-next-line @elsikora-typescript/typedef,no-await-in-loop
                    const hasFileIndicators = await Promise.all(config.fileIndicators.map((file) => fileExists(file)));
                    if (hasFileIndicators.some((exists) => exists)) {
                        return {
                            framework: { framework: config, hasTypescript },
                            customPaths: [],
                        };
                    }
                }
                else {
                    return {
                        framework: { framework: config, hasTypescript },
                        customPaths: [],
                    };
                }
            }
        }
        // If no framework detected, look for source directories
        const sourceDirs = await detectSourceDirectory();
        if (sourceDirs.length > 0) {
            const extensions = hasTypescript ? "{js,jsx,ts,tsx}" : "{js,jsx}";
            return {
                framework: null,
                customPaths: sourceDirs.map((dir) => `./${dir}/**/*.${extensions}`),
            };
        }
        // Fallback to scanning current directory
        return {
            framework: null,
            customPaths: [`./**/*.${hasTypescript ? "{js,jsx,ts,tsx}" : "{js,jsx}"}`],
        };
        // eslint-disable-next-line @elsikora-typescript/no-unused-vars
    }
    catch (error) {
        return {
            framework: null,
            customPaths: ["./**/*.{js,jsx,ts,tsx}"],
        };
    }
}
function generateIgnoreConfig(framework) {
    const commonIgnores = ["**/node_modules/", "**/.git/", "**/dist/", "**/build/", "**/coverage/", "**/.vscode/", "**/.idea/", "**/*.min.js", "**/*.bundle.js"];
    if (framework) {
        const { directories, patterns } = framework.framework.ignorePaths;
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
    const dirPaths = basePaths.map((path) => {
        // Remove file pattern from path to get directory
        return path.split("/*")[0];
    });
    // Get unique directories
    const uniqueDirs = [...new Set(dirPaths)];
    const commands = {
        lint: [`eslint ${uniqueDirs.join(" ")}`],
        fix: [`eslint ${uniqueDirs.join(" ")} --fix`],
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

async function getConfigFileExtension() {
    try {
        const packageJsonPath = path.resolve(process.cwd(), "package.json");
        const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
        const packageJson = JSON.parse(packageJsonContent);
        // eslint-disable-next-line @elsikora-typescript/no-unused-vars
        const isModule = packageJson.type === "module";
        return ".js";
        //return isModule ? ".mjs" : ".cjs";
    }
    catch {
        return ".js";
    }
}
async function createEslintConfig(features, extension, detectedFramework) {
    const { ignores } = generateIgnoreConfig(detectedFramework);
    const configContent = `import createConfig from '@elsikora/eslint-config';

export default [
  {
    ignores: ${JSON.stringify(ignores, null, 2)}
  },
  ...createConfig({
${features.map((feature) => `    ${feature}: true`).join(",\n")}
  })
];
`;
    await fs.writeFile(`eslint.config${extension}`, configContent, "utf-8");
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
async function updatePackageJson(framework, customPaths, includePrettier = false, includeStylelint) {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    packageJson.type = "module";
    // Generate lint paths and commands
    const { lintCommand, lintFixCommand } = generateLintCommands(framework, customPaths, !!includeStylelint, includePrettier);
    // Generate watch commands if framework supports it
    let watchCommands = {};
    if (framework) {
        switch (framework.framework.name) {
            case "next":
            case "nest":
            case "express":
            case "koa":
            case "fastify":
                watchCommands = {
                    "lint:watch": `npx eslint-watch ${framework.framework.lintPaths.join(" ")}`,
                };
                break;
        }
    }
    // Generate framework-specific validation scripts
    let frameworkScripts = {};
    if (framework) {
        switch (framework.framework.name) {
            case "next":
                frameworkScripts = {
                    "lint:types": "tsc --noEmit",
                    "lint:all": "npm run lint && npm run lint:types",
                };
                break;
            case "nest":
                frameworkScripts = {
                    "lint:types": "tsc --noEmit",
                    "lint:test": 'eslint "{src,apps,libs,test}/**/*.spec.ts"',
                    "lint:all": "npm run lint && npm run lint:types && npm run lint:test",
                };
                break;
            case "angular":
                frameworkScripts = {
                    "lint:types": "tsc --noEmit",
                    "lint:test": 'eslint "**/*.spec.ts"',
                    "lint:all": "ng lint && npm run lint:types && npm run lint:test",
                };
                break;
        }
    }
    // Generate type checking script if TypeScript is used
    const typeScripts = framework?.hasTypescript
        ? {
            "lint:types": "tsc --noEmit",
            "lint:all": `npm run lint${framework?.hasTypescript ? " && npm run lint:types" : ""}`,
        }
        : {};
    // Combine all scripts
    // @ts-ignore
    // eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
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
async function checkForStylelintConfigInPackageJson() {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    return Object.prototype.hasOwnProperty.call(packageJson, "stylelint");
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

const exec$1 = promisify(exec$3);
async function installStylelintDependencies() {
    const stylelintDeps = ["stylelint@^16.10.0", "stylelint-config-css-modules@^4.4.0", "stylelint-config-rational-order@^0.1.2", "stylelint-config-standard-scss@^13.1.0", "stylelint-order@^6.0.4", "stylelint-prettier@^5.0.2"];
    await exec$1(`npm install -D ${stylelintDeps.join(" ")}`);
}
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
    settings["eslint.validate"] = Array.from(languages).map((language) => ({
        language,
        autoFix: true,
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
    const extensions = new Set(["js", "ts", "jsx", "tsx", "cjs", "cts", "mjs", "mts", "html", "vue", "json", "yaml", "yml"]);
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
    const filesPattern = `**/*.{${Array.from(extensions).join(",")}}`;
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

const exec = promisify(exec$3);
async function runCli() {
    console.clear();
    intro(color.cyan("ESLint Configuration Setup (@elsikora/eslint-config)"));
    const { isInstalled: hasEslint, version: eslintVersion } = await checkEslintInstalled();
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
                messageLines.push("");
                messageLines.push("Do you want to delete them?");
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
        const majorVersion = parseInt(eslintVersion.split(".")[0], 10);
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
                // eslint-disable-next-line @elsikora-typescript/restrict-template-expressions
                name: `${feature} - ${config.description}`,
                value: feature,
                checked: feature === "javascript" ||
                    (shouldUseDetected && detectedFeatures.includes(feature)),
                disabled: feature === "javascript" ?
                    "Required" :
                    (config.requiresTypescript && !hasTypescript ?
                        "Requires TypeScript" :
                        false),
            });
        }
    }
    const answers = await inquirer.prompt([
        {
            type: "checkbox",
            name: "selectedFeatures",
            message: "Select the features you want to enable:",
            choices: selectOptions,
            // eslint-disable-next-line @elsikora-typescript/no-magic-numbers
            pageSize: 15,
            // eslint-disable-next-line @elsikora-typescript/explicit-function-return-type,@elsikora-typescript/typedef
            validate(answer) {
                if (answer.length < 1) {
                    return "You must choose at least one feature.";
                }
                return true;
            },
        },
    ]);
    // eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access,@elsikora-typescript/no-unsafe-assignment
    const selectedFeatures = answers.selectedFeatures;
    if (!selectedFeatures || selectedFeatures.length === 0) {
        outro(color.red("No features selected. Configuration aborted."));
        process.exit(1);
    }
    if (!selectedFeatures.includes("javascript")) {
        selectedFeatures.unshift("javascript");
    }
    const { isValid, errors } = await validateFeatureSelection(selectedFeatures);
    if (!isValid) {
        outro(color.red("Configuration cannot proceed due to the following errors:"));
        errors.forEach((error) => { console.error(color.red(`- ${error}`)); });
        process.exit(1);
    }
    const setupSpinner = spinner();
    try {
        // Start the spinner for ESLint configuration
        setupSpinner.start("Setting up ESLint configuration...");
        const configExtension = await getConfigFileExtension();
        const { framework } = await detectProjectStructure();
        if (framework) {
            note([`Detected ${framework.framework.name} project structure.`, `Will configure linting for the following paths:`, ...framework.framework.lintPaths.map((path) => `  - ${path}`), "", "Additional ignore patterns will be added to the configuration."].join("\n"), "Framework Detection");
        }
        // eslint-disable-next-line @elsikora-typescript/no-unsafe-argument
        await installDependencies(selectedFeatures);
        // eslint-disable-next-line @elsikora-typescript/no-unsafe-argument
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
                messageLines.push("");
                messageLines.push("Do you want to delete them?");
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
        // eslint-disable-next-line @elsikora-typescript/no-unsafe-call,@elsikora-typescript/no-unsafe-member-access
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
                messageLines.push("");
                messageLines.push("Do you want to delete them?");
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
                    type: "checkbox",
                    name: "selectedIDEs",
                    message: "Select your code editor(s):",
                    choices: [
                        { name: "VSCode", value: "vscode" },
                        { name: "WebStorm (IntelliJ IDEA)", value: "webstorm" },
                    ],
                    // eslint-disable-next-line @elsikora-typescript/explicit-function-return-type
                    validate(answer) {
                        // eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access
                        if (answer.length < 1) {
                            return "You must choose at least one code editor.";
                        }
                        return true;
                    },
                },
            ]);
            // eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access,@elsikora-typescript/no-unsafe-assignment
            const selectedIDEs = ideAnswers.selectedIDEs;
            // eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access,@elsikora-typescript/no-unsafe-call
            if (selectedIDEs.includes("vscode")) {
                // eslint-disable-next-line @elsikora-typescript/no-unsafe-argument
                await setupVSCodeConfig(selectedFeatures);
            }
            // eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access,@elsikora-typescript/no-unsafe-call
            if (selectedIDEs.includes("webstorm")) {
                // eslint-disable-next-line @elsikora-typescript/no-unsafe-argument,@elsikora-typescript/no-unsafe-call,@elsikora-typescript/no-unsafe-member-access
                await setupWebStormConfig(selectedFeatures, selectedFeatures.includes("prettier"));
            }
        }
        try {
            const { framework, customPaths } = await detectProjectStructure();
            if (framework) {
                note([`Detected ${framework.framework.name} project structure.`, "Will configure linting for:", ...framework.framework.lintPaths.map((path) => `  - ${path}`)].join("\n"), "Framework Detection");
            }
            // eslint-disable-next-line @elsikora-typescript/no-unsafe-argument,@elsikora-typescript/no-unsafe-member-access,@elsikora-typescript/no-unsafe-call
            await updatePackageJson(framework, customPaths, selectedFeatures.includes("prettier"), installStylelint);
            const scriptDescriptions = [];
            // Basic lint commands
            scriptDescriptions.push("Available commands:");
            scriptDescriptions.push("  npm run lint      # check for ESLint issues");
            scriptDescriptions.push("  npm run lint:fix  # automatically fix ESLint issues");
            // Framework-specific commands
            if (framework) {
                if (framework.hasTypescript) {
                    scriptDescriptions.push("  npm run lint:types # check TypeScript types");
                    scriptDescriptions.push("  npm run lint:all   # run all checks (ESLint + TypeScript)");
                }
                switch (framework.framework.name) {
                    case "next":
                    case "express":
                    case "koa":
                    case "fastify":
                        scriptDescriptions.push("  npm run lint:watch # watch mode: lint files on change");
                        break;
                    case "nest":
                        scriptDescriptions.push("  npm run lint:watch # watch mode: lint files on change");
                        scriptDescriptions.push("  npm run lint:test  # lint test files");
                        break;
                    case "angular":
                        scriptDescriptions.push("  npm run lint:test  # lint test files");
                        break;
                }
            }
            // Stylelint commands
            if (installStylelint) {
                scriptDescriptions.push("");
                scriptDescriptions.push("Stylelint commands:");
                scriptDescriptions.push("  npm run lint      # includes CSS/SCSS linting");
                scriptDescriptions.push("  npm run lint:fix  # includes CSS/SCSS auto-fixing");
            }
            // Prettier commands
            // eslint-disable-next-line @elsikora-typescript/no-unsafe-call,@elsikora-typescript/no-unsafe-member-access
            if (selectedFeatures.includes("prettier")) {
                scriptDescriptions.push("");
                scriptDescriptions.push("Prettier commands:");
                scriptDescriptions.push("  npm run format     # check code formatting");
                scriptDescriptions.push("  npm run format:fix # automatically format code");
            }
            if (framework) {
                // eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
                note(["ESLint has been configured for your project.", `Framework: ${framework.framework.name}`, framework.hasTypescript ? "TypeScript support: enabled" : "", "", ...scriptDescriptions].filter(Boolean).join("\n"), "Configuration Summary");
            }
            else {
                // eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
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
