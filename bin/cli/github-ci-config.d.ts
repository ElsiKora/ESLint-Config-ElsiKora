import type { TGitHubCIFile } from "./types";
export declare function setupGitHubCIConfig(selectedFiles: Array<TGitHubCIFile>, isNpmPackage?: boolean, dependabotBranch?: string): Promise<void>;
