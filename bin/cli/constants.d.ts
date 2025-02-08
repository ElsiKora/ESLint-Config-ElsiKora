import type { IFeatureConfig, ILicenseConfig } from "./types";
export declare const LICENSE_CONFIGS: Record<string, ILicenseConfig>;
export declare const FEATURES_CONFIG: Record<string, IFeatureConfig>;
export declare const FEATURE_GROUPS: Record<string, Array<string>>;
export declare const ESLINT_CONFIG_FILES: Array<string>;
export declare const PRETTIER_CONFIG_FILES: Array<string>;
export declare const STYLELINT_CONFIG_FILES: Array<string>;
export declare const CORE_DEPENDENCIES: Array<string>;
export declare const GITHUB_CI_FILES: {
    readonly CODECOMMIT_SYNC: {
        readonly description: "Mirror repository to AWS CodeCommit";
        readonly name: "codecommit-sync.yml";
    };
    readonly DEPENDABOT: {
        readonly description: "Automated dependency updates";
        readonly name: "dependabot.yml";
    };
    readonly QODANA: {
        readonly description: "JetBrains Qodana code quality scan";
        readonly name: "qodana-code-quality.yml";
    };
    readonly RELEASE_NPM: {
        readonly description: "Release workflow";
        readonly name: "release.yml";
    };
    readonly SNYK: {
        readonly description: "Snyk security scanning";
        readonly name: "snyk-security-scan.yml";
    };
};
export declare const CI_FILE_CONTENTS: {
    CODECOMMIT_SYNC: string;
    DEPENDABOT: string;
    QODANA: string;
    RELEASE_NON_NPM: string;
    RELEASE_NPM: string;
    SNYK: string;
};
