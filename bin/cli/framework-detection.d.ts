import type { IDetectedFramework } from "./types";
export declare function detectProjectStructure(): Promise<{
    customPaths: Array<string>;
    framework: IDetectedFramework | null;
}>;
export declare function generateIgnoreConfig(framework: IDetectedFramework | null): {
    ignores: Array<string>;
    lintPaths: Array<string>;
};
export declare function generateLintCommands(framework: IDetectedFramework | null, customPaths: Array<string>, includeStylelint: boolean, includePrettier: boolean): {
    lintCommand: string;
    lintFixCommand: string;
};
