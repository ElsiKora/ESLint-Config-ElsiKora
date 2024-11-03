import fs from "node:fs/promises";
import path from "node:path";
import type { IDetectedFramework, IPackageJson, TFeature } from "./types";
import { generateIgnoreConfig, generateLintCommands } from "./framework-detection";

export async function getConfigFileExtension(): Promise<string> {
	try {
		const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
		const packageJsonContent: string = await fs.readFile(packageJsonPath, "utf8");
		const packageJson: IPackageJson = JSON.parse(packageJsonContent) as IPackageJson;
		// eslint-disable-next-line @elsikora-typescript/no-unused-vars
		const isModule: boolean = packageJson.type === "module";

		return ".js";
		//return isModule ? ".mjs" : ".cjs";
	} catch {
		return ".js";
	}
}

export async function createEslintConfig(features: Array<TFeature>, extension: string, detectedFramework: IDetectedFramework | null): Promise<void> {
	const { ignores }: { ignores: Array<string>; lintPaths: Array<string> } = generateIgnoreConfig(detectedFramework);

	const configContent: string = `import createConfig from '@elsikora/eslint-config';

export default [
  {
    ignores: ${JSON.stringify(ignores, null, 2)}
  },
  ...createConfig({
${features.map((feature: string) => `    ${feature}: true`).join(",\n")}
  })
];
`;
	await fs.writeFile(`eslint.config${extension}`, configContent, "utf-8");
}

export async function createPrettierConfig(extension: string): Promise<void> {
	const prettierConfigContent: string = `export default {
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

	const prettierIgnoreContent: string = `node_modules
dist
build
`;
	await fs.writeFile(".prettierignore", prettierIgnoreContent, "utf-8");
}

export async function updatePackageJson(framework: IDetectedFramework | null, customPaths: Array<string>, includePrettier: boolean = false, includeStylelint?: symbol | boolean): Promise<void> {
	const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
	const packageJsonContent: string = await fs.readFile(packageJsonPath, "utf8");
	const packageJson: IPackageJson = JSON.parse(packageJsonContent) as IPackageJson;

	packageJson.type = "module";

	// Generate lint paths and commands
	const { lintCommand, lintFixCommand }: { lintCommand: string; lintFixCommand: string } = generateLintCommands(framework, customPaths, !!includeStylelint, includePrettier);

	// Generate watch commands if framework supports it
	let watchCommands: any = {};
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
	let frameworkScripts: object = {};
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

	const typeScripts: { "lint:types": string; "lint:all": string } | object = framework?.hasTypescript
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

export async function removeEslintConfigFromPackageJson(): Promise<void> {
	const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
	const packageJsonContent: string = await fs.readFile(packageJsonPath, "utf8");
	const packageJson: IPackageJson = JSON.parse(packageJsonContent) as IPackageJson;

	if (packageJson.eslintConfig) {
		delete packageJson.eslintConfig;
		// eslint-disable-next-line @elsikora-typescript/no-magic-numbers
		await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
	}
}

export async function removePrettierConfigFromPackageJson(): Promise<void> {
	const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
	const packageJsonContent: string = await fs.readFile(packageJsonPath, "utf8");
	const packageJson: IPackageJson = JSON.parse(packageJsonContent) as IPackageJson;

	if (packageJson.prettier) {
		delete packageJson.prettier;
		// eslint-disable-next-line @elsikora-typescript/no-magic-numbers
		await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
	}
}

export async function checkForStylelintConfigInPackageJson(): Promise<boolean> {
	const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
	const packageJsonContent: string = await fs.readFile(packageJsonPath, "utf8");
	const packageJson: IPackageJson = JSON.parse(packageJsonContent) as IPackageJson;
	return Object.prototype.hasOwnProperty.call(packageJson, "stylelint");
}

export async function removeStylelintConfigFromPackageJson(): Promise<void> {
	const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
	const packageJsonContent: string = await fs.readFile(packageJsonPath, "utf8");
	const packageJson: IPackageJson = JSON.parse(packageJsonContent) as IPackageJson;

	if (packageJson.stylelint) {
		delete packageJson.stylelint;
		// eslint-disable-next-line @elsikora-typescript/no-magic-numbers
		await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
	}
}

export async function checkForEslintConfigInPackageJson(): Promise<boolean> {
	const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
	const packageJsonContent: string = await fs.readFile(packageJsonPath, "utf8");
	const packageJson: IPackageJson = JSON.parse(packageJsonContent) as IPackageJson;
	return Object.prototype.hasOwnProperty.call(packageJson, "eslintConfig");
}

export async function checkForPrettierConfigInPackageJson(): Promise<boolean> {
	const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
	const packageJsonContent: string = await fs.readFile(packageJsonPath, "utf8");
	const packageJson: IPackageJson = JSON.parse(packageJsonContent) as IPackageJson;
	return Object.prototype.hasOwnProperty.call(packageJson, "prettier");
}
