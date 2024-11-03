import fs from "node:fs/promises";
import path from "node:path";
import type { IDetectedFramework, IFrameworkConfig, IPackageJson } from "./types";

const FRAMEWORK_CONFIGS: Array<IFrameworkConfig> = [
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

async function fileExists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function detectSourceDirectory(): Promise<Array<string>> {
	const commonDirs: Array<string> = ["src", "app", "source", "lib"];
	const existingDirs: Array<string> = [];

	for (const dir of commonDirs) {
		// eslint-disable-next-line no-await-in-loop
		if (await fileExists(dir)) {
			existingDirs.push(dir);
		}
	}

	return existingDirs;
}

export async function detectProjectStructure(): Promise<{
	framework: IDetectedFramework | null;
	customPaths: Array<string>;
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
			const hasPackageIndicators: boolean = config.packageIndicators.some((pkg) => !!allDependencies[pkg]);

			if (hasPackageIndicators) {
				// If there are file indicators, check them too
				if (config.fileIndicators) {
					// eslint-disable-next-line @elsikora-typescript/typedef,no-await-in-loop
					const hasFileIndicators = await Promise.all(config.fileIndicators.map((file) => fileExists(file)));

					if (hasFileIndicators.some((exists: boolean) => exists)) {
						return {
							framework: { framework: config, hasTypescript },
							customPaths: [],
						};
					}
				} else {
					return {
						framework: { framework: config, hasTypescript },
						customPaths: [],
					};
				}
			}
		}

		// If no framework detected, look for source directories
		const sourceDirs: Array<string> = await detectSourceDirectory();
		if (sourceDirs.length > 0) {
			const extensions: string = hasTypescript ? "{js,jsx,ts,tsx}" : "{js,jsx}";
			return {
				framework: null,
				customPaths: sourceDirs.map((dir: string) => `./${dir}/**/*.${extensions}`),
			};
		}

		// Fallback to scanning current directory
		return {
			framework: null,
			customPaths: [`./**/*.${hasTypescript ? "{js,jsx,ts,tsx}" : "{js,jsx}"}`],
		};
		// eslint-disable-next-line @elsikora-typescript/no-unused-vars
	} catch (error) {
		return {
			framework: null,
			customPaths: ["./**/*.{js,jsx,ts,tsx}"],
		};
	}
}

export function generateIgnoreConfig(framework: IDetectedFramework | null): {
	ignores: Array<string>;
	lintPaths: Array<string>;
} {
	const commonIgnores: Array<string> = ["**/node_modules/", "**/.git/", "**/dist/", "**/build/", "**/coverage/", "**/.vscode/", "**/.idea/", "**/*.min.js", "**/*.bundle.js"];

	if (framework) {
		const { directories, patterns }: { directories: Array<string>; patterns: Array<string> } = framework.framework.ignorePaths;

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

export function generateLintCommands(framework: IDetectedFramework | null, customPaths: Array<string>, includeStylelint: boolean, includePrettier: boolean): { lintCommand: string; lintFixCommand: string } {
	// Convert paths to directory patterns
	const basePaths: Array<string> = framework?.framework.lintPaths ?? customPaths;
	const dirPaths: Array<string> = basePaths.map((path: string) => {
		// Remove file pattern from path to get directory
		return path.split("/*")[0];
	});

	// Get unique directories
	const uniqueDirs: Array<string> = [...new Set(dirPaths)];

	const commands: { lint: Array<string>; fix: Array<string> } = {
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
