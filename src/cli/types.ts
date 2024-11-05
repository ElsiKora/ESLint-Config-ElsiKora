import type { FEATURES_CONFIG } from "./constants";

export interface IPackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	type?: string;
	scripts?: Record<string, string>;
	eslintConfig?: any;
	prettier?: any;
	stylelint?: any;
}

export interface IFeatureConfig {
	packages: Array<string>;
	detect?: Array<string>;
	required?: boolean;
	description?: string;
	requiresTypescript?: boolean;
}

export type TFeature = keyof typeof FEATURES_CONFIG;

export interface IFrameworkConfig {
	name: string;
	lintPaths: Array<string>;
	ignorePaths: {
		directories: Array<string>; // Directories to ignore completely
		patterns: Array<string>; // File patterns to ignore
	};
	packageIndicators: Array<string>;
	fileIndicators?: Array<string>;
}

export interface IDetectedFramework {
	framework: IFrameworkConfig;
	hasTypescript: boolean;
}
