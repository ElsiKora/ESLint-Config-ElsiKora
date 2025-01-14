import fs from "node:fs/promises";
import path from "node:path";
import { CI_FILE_CONTENTS, GITHUB_CI_FILES } from "./constants";
import type { TGitHubCIFile } from "./types";

export async function setupGitHubCIConfig(selectedFiles: Array<TGitHubCIFile>, isNpmPackage: boolean = false, dependabotBranch: string = "dev"): Promise<void> {
	const githubDir = path.resolve(process.cwd(), ".github");
	const workflowsDir = path.resolve(githubDir, "workflows");

	// Create .github and workflows directories
	await fs.mkdir(workflowsDir, { recursive: true });

	for (const file of selectedFiles) {
		let content: string;

		// Special handling for release.yml
		if (file === "RELEASE_NPM") {
			content = isNpmPackage ? CI_FILE_CONTENTS.RELEASE_NPM : CI_FILE_CONTENTS.RELEASE_NON_NPM;
			await fs.writeFile(path.resolve(workflowsDir, GITHUB_CI_FILES[file].name), content, "utf-8");
			continue;
		}

		// Handle other files
		content = CI_FILE_CONTENTS[file];

		// Modify dependabot.yml content if it's being created
		if (file === "DEPENDABOT") {
			content = `version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    target-branch: "${dependabotBranch}"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "daily"
    target-branch: "${dependabotBranch}"`;
			await fs.writeFile(path.resolve(githubDir, GITHUB_CI_FILES[file].name), content, "utf-8");
		} else {
			await fs.writeFile(path.resolve(workflowsDir, GITHUB_CI_FILES[file].name), content, "utf-8");
		}
	}
}
