import type { IDetectedFramework, IFrameworkConfig, IPackageJson } from "./types";

import fs from "node:fs/promises";
import path from "node:path";

const FRAMEWORK_CONFIGS: Array<IFrameworkConfig> = [
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

export async function detectProjectStructure(): Promise<{
	customPaths: Array<string>;
	framework: IDetectedFramework | null;
}> {
	try {
		const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
		const packageJsonContent: string = await fs.readFile(packageJsonPath, "utf8");
		const packageJson: IPackageJson = JSON.parse(packageJsonContent) as IPackageJson;

		const allDependencies: object = {
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
			const hasPackageIndicators: boolean = config.packageIndicators.some((package_) => !!allDependencies[package_]);

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
				} else {
					return {
						customPaths: [],
						framework: { framework: config, hasTypescript },
					};
				}
			}
		}

		// If no framework detected, look for source directories
		const sourceDirectories: Array<string> = await detectSourceDirectory();

		if (sourceDirectories.length > 0) {
			const extensions: string = hasTypescript ? "{js,jsx,ts,tsx}" : "{js,jsx}";

			return {
				customPaths: sourceDirectories.map((dir: string) => `./${dir}/**/*.${extensions}`),
				framework: null,
			};
		}

		// Fallback to scanning current directory
		return {
			customPaths: [`./**/*.${hasTypescript ? "{js,jsx,ts,tsx}" : "{js,jsx}"}`],
			framework: null,
		};
	} catch {
		return {
			customPaths: ["./**/*.{js,jsx,ts,tsx}"],
			framework: null,
		};
	}
}

export function generateIgnoreConfig(framework: IDetectedFramework | null): {
	ignores: Array<string>;
	lintPaths: Array<string>;
} {
	const commonIgnores: Array<string> = ["**/node_modules/", "**/.git/", "**/dist/", "**/build/", "**/coverage/", "**/.vscode/", "**/.idea/", "**/*.min.js", "**/*.bundle.js"];

	if (framework) {
		const {
			directories,
			patterns,
		}: {
			directories: Array<string>;
			patterns: Array<string>;
		} = framework.framework.ignorePaths;

		// Convert directory ignores to proper format
		const directoryIgnores: Array<string> = directories.map((dir: string) => (dir.endsWith("/") ? `**/${dir}**/*` : `**/${dir}/**/*`));

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

export function generateLintCommands(
	framework: IDetectedFramework | null,
	customPaths: Array<string>,
	includeStylelint: boolean,
	includePrettier: boolean,
): {
	lintCommand: string;
	lintFixCommand: string;
} {
	// Convert paths to directory patterns
	const basePaths: Array<string> = framework?.framework.lintPaths ?? customPaths;

	const dirPaths: Array<string> = basePaths.map((path: string) => {
		// Remove file pattern from path to get directory
		return path.split("/*")[0];
	});

	// Get unique directories
	const uniqueDirectories: Array<string> = [...new Set(dirPaths)];

	const commands: { fix: Array<string>; lint: Array<string> } = {
		fix: [`eslint ${uniqueDirectories.join(" ")} --fix`],
		lint: [`eslint ${uniqueDirectories.join(" ")}`],
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

async function detectSourceDirectory(): Promise<Array<string>> {
	const commonDirectories: Array<string> = ["src", "app", "source", "lib"];
	const existingDirectories: Array<string> = [];

	for (const dir of commonDirectories) {
		// eslint-disable-next-line no-await-in-loop
		if (await fileExists(dir)) {
			existingDirectories.push(dir);
		}
	}

	return existingDirectories;
}

async function fileExists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);

		return true;
	} catch {
		return false;
	}
}
