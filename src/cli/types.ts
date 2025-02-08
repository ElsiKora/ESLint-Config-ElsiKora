import type { FEATURES_CONFIG, GITHUB_CI_FILES } from "./constants";

export interface IDetectedFramework {
	framework: IFrameworkConfig;
	hasTypescript: boolean;
}

export interface IFeatureConfig {
	description?: string;
	detect?: Array<string>;
	packages: Array<string>;
	required?: boolean;
	requiresTypescript?: boolean;
}

export interface IFrameworkConfig {
	fileIndicators?: Array<string>;
	ignorePaths: {
		directories: Array<string>; // Directories to ignore completely
		patterns: Array<string>; // File patterns to ignore
	};
	lintPaths: Array<string>;
	name: string;
	packageIndicators: Array<string>;
}

export interface ILicenseConfig {
	description: string;
	name: string;
	template: (year: string, author: string) => string;
}

export interface IPackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	eslintConfig?: any;
	prettier?: any;
	scripts?: Record<string, string>;
	stylelint?: any;
	type?: string;
}

export type TFeature = keyof typeof FEATURES_CONFIG;

export type TGitHubCIFile = keyof typeof GITHUB_CI_FILES;
