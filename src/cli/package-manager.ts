import type { IFeatureConfig, IPackageJson, TFeature } from "./types";

import { exec as execCallback } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { CORE_DEPENDENCIES, FEATURES_CONFIG } from "./constants";

const exec: (argument1: any) => Promise<any> = promisify(execCallback);

export async function checkConfigInstalled(): Promise<{
	isInstalled: boolean;
	version: null | string;
}> {
	try {
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
		const { stdout }: any = await exec("npm ls @elsikora/eslint-config --all --depth=0 --json");
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment,@elsikora-typescript/typedef,@elsikora-typescript/no-unsafe-argument
		const npmList = JSON.parse(stdout);
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment,@elsikora-typescript/no-unsafe-member-access
		const configVersion: null | string = npmList.dependencies?.["@elsikora/eslint-config"]?.version || npmList.devDependencies?.["@elsikora/eslint-config"]?.version || null;

		return { isInstalled: !!configVersion, version: configVersion };
	} catch {
		return { isInstalled: false, version: null };
	}
}

export async function checkEslintInstalled(): Promise<{
	isInstalled: boolean;
	version: null | string;
}> {
	try {
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
		const { stdout }: any = await exec("npm ls eslint --all --depth=0 --json");
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-argument,@elsikora-typescript/no-unsafe-assignment
		const npmList: any = JSON.parse(stdout);
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment,@elsikora-typescript/no-unsafe-member-access
		const eslintVersion: null | string = npmList.dependencies?.eslint?.version || npmList.devDependencies?.eslint?.version || null;

		return { isInstalled: !!eslintVersion, version: eslintVersion };
	} catch {
		return { isInstalled: false, version: null };
	}
}

export async function detectInstalledFeatures(): Promise<Array<TFeature>> {
	try {
		const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
		const packageJsonContent: string = await fs.readFile(packageJsonPath, "utf8");
		const packageJson: IPackageJson = JSON.parse(packageJsonContent) as IPackageJson;

		const allDependencies: object = {
			...packageJson.dependencies,
			...packageJson.devDependencies,
		};
		const detectedFeatures: Set<TFeature> = new Set<TFeature>();

		for (const [feature, config] of Object.entries(FEATURES_CONFIG)) {
			if (config.required) {
				detectedFeatures.add(feature);
			}
		}

		for (const [feature, config] of Object.entries(FEATURES_CONFIG)) {
			if (config.detect) {
				// @ts-ignore
				const isDetected: boolean = config.detect.some((package_: string) => !!allDependencies[package_]);

				if (isDetected) {
					detectedFeatures.add(feature);
				}
			}
		}

		return [...detectedFeatures];
	} catch {
		return ["javascript"];
	}
}

export async function detectTypescriptInProject(): Promise<boolean> {
	try {
		const packageJsonPath: string = path.resolve(process.cwd(), "package.json");
		const packageJsonContent: string = await fs.readFile(packageJsonPath, "utf8");
		const packageJson: IPackageJson = JSON.parse(packageJsonContent) as IPackageJson;

		const allDependencies: object = {
			...packageJson.dependencies,
			...packageJson.devDependencies,
		};

		// @ts-ignore
		return !!(allDependencies.typescript || allDependencies["@types/node"]);
	} catch {
		return false;
	}
}

export async function installDependencies(features: Array<TFeature>): Promise<void> {
	const depsToInstall: Set<string> = new Set<string>(CORE_DEPENDENCIES);

	for (const feature of features) {
		const config: IFeatureConfig = FEATURES_CONFIG[feature];

		if (config?.packages) {
			config.packages.forEach((package_: string) => depsToInstall.add(package_));
		}
	}

	const depsArray: Array<string> = [...depsToInstall];
	await exec(`npm install -D ${depsArray.join(" ")}`);
}

export async function validateFeatureSelection(features: Array<TFeature>): Promise<{
	errors: Array<string>;
	isValid: boolean;
}> {
	const hasTypescript: boolean = await detectTypescriptInProject();
	const errors: Array<string> = [];

	for (const feature of features) {
		const config: IFeatureConfig = FEATURES_CONFIG[feature];

		if (config.requiresTypescript && !hasTypescript) {
			errors.push(`${feature} requires TypeScript, but TypeScript is not detected in your project. Please install TypeScript first.`);
		}
	}

	return {
		errors,
		isValid: errors.length === 0,
	};
}
