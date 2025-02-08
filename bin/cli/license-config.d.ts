export declare function checkForExistingLicense(): Promise<{
    exists: boolean;
    path?: string;
}>;
export declare function createLicense(licenseType: string): Promise<void>;
export declare function getAuthorFromPackageJson(): Promise<string>;
export declare function getLicenseChoices(): Array<{
    name: string;
    value: string;
}>;
