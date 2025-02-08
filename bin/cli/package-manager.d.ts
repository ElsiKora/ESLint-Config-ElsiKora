import type { TFeature } from "./types";
export declare function checkConfigInstalled(): Promise<{
    isInstalled: boolean;
    version: null | string;
}>;
export declare function checkEslintInstalled(): Promise<{
    isInstalled: boolean;
    version: null | string;
}>;
export declare function detectInstalledFeatures(): Promise<Array<TFeature>>;
export declare function detectTypescriptInProject(): Promise<boolean>;
export declare function installDependencies(features: Array<TFeature>): Promise<void>;
export declare function validateFeatureSelection(features: Array<TFeature>): Promise<{
    errors: Array<string>;
    isValid: boolean;
}>;
