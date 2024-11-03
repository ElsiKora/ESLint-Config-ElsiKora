import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import type { IPackageJson, TFeature, IFeatureConfig } from "./types";
import { FEATURES_CONFIG, CORE_DEPENDENCIES } from "./constants";

const exec: (arg1: any) => Promise<any> = promisify(execCallback);

export async function checkEslintInstalled(): Promise<{
	isInstalled: boolean;
	version: string | null;
}> {
	try {
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
		const { stdout }: any = await exec("npm ls eslint --all --depth=0 --json");
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-argument,@elsikora-typescript/no-unsafe-assignment
		const npmList: any = JSON.parse(stdout);
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment,@elsikora-typescript/no-unsafe-member-access
		const eslintVersion: string | null = npmList.dependencies?.eslint?.version || npmList.devDependencies?.eslint?.version || null;
		return { isInstalled: !!eslintVersion, version: eslintVersion };
	} catch {
		return { isInstalled: false, version: null };
	}
}

export async function checkConfigInstalled(): Promise<{
	isInstalled: boolean;
	version: string | null;
}> {
	try {
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
		const { stdout }: any = await exec("npm ls @elsikora/eslint-config --all --depth=0 --json");
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment,@elsikora-typescript/typedef,@elsikora-typescript/no-unsafe-argument
		const npmList = JSON.parse(stdout);
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment,@elsikora-typescript/no-unsafe-member-access
		const configVersion: string | null = npmList.dependencies?.["@elsikora/eslint-config"]?.version || npmList.devDependencies?.["@elsikora/eslint-config"]?.version || null;
		return { isInstalled: !!configVersion, version: configVersion };
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
				const isDetected: boolean = config.detect.some((pkg: string) => !!allDependencies[pkg]);
				if (isDetected) {
					detectedFeatures.add(feature);
				}
			}
		});

		return Array.from(detectedFeatures);
	} catch {
		return ["javascript"];
	}
}

export async function installDependencies(features: Array<TFeature>): Promise<void> {
	const depsToInstall: Set<string> = new Set<string>(CORE_DEPENDENCIES);

	for (const feature of features) {
		const config: IFeatureConfig = FEATURES_CONFIG[feature];
		if (config?.packages) {
			config.packages.forEach((pkg: string) => depsToInstall.add(pkg));
		}
	}

	const depsArray: Array<string> = [...depsToInstall];
	await exec(`npm install -D ${depsArray.join(" ")}`);
}
