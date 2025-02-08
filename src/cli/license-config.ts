import fs from "node:fs/promises";
import path from "node:path";

import { LICENSE_CONFIGS } from "./constants";

export async function checkForExistingLicense(): Promise<{
	exists: boolean;
	path?: string;
}> {
	const commonLicenseFiles = ["LICENSE", "LICENSE.txt", "LICENSE.md", "license", "license.txt", "license.md", "COPYING", "COPYING.txt", "COPYING.md"];

	try {
		for (const file of commonLicenseFiles) {
			try {
				const filePath = path.resolve(process.cwd(), file);
				await fs.access(filePath);

				return { exists: true, path: file };
			} catch {}
		}

		return { exists: false };
	} catch {
		return { exists: false };
	}
}

export async function createLicense(licenseType: string): Promise<void> {
	const config = LICENSE_CONFIGS[licenseType];

	if (!config) {
		throw new Error(`Unsupported license type: ${licenseType}`);
	}

	const year = new Date().getFullYear().toString();
	const author = await getAuthorFromPackageJson();

	const licenseContent = config.template(year, author);
	await fs.writeFile("LICENSE", licenseContent, "utf-8");
}

export async function getAuthorFromPackageJson(): Promise<string> {
	try {
		const packageJsonPath = path.resolve(process.cwd(), "package.json");
		const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
		const packageJson = JSON.parse(packageJsonContent);

		if (packageJson.author) {
			if (typeof packageJson.author === "string") {
				return packageJson.author;
			}

			if (typeof packageJson.author === "object" && packageJson.author.name) {
				return packageJson.author.name;
			}
		}

		return "";
	} catch {
		return "";
	}
}

export function getLicenseChoices(): Array<{
	name: string;
	value: string;
}> {
	return Object.entries(LICENSE_CONFIGS).map(([key, config]) => ({
		name: `${config.name} - ${config.description}`,
		value: key,
	}));
}
