import type { IDetectedFramework, IFeatureConfig, TFeature, TGitHubCIFile } from "./types";

import { exec as execCallback } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { confirm, intro, note, outro, spinner } from "@clack/prompts";
import inquirer from "inquirer";
import color from "picocolors";

import { checkForEslintConfigInPackageJson, checkForPrettierConfigInPackageJson, checkForStylelintConfigInPackageJson, createEslintConfig, createPrettierConfig, getConfigFileExtension, removeEslintConfigFromPackageJson, removePrettierConfigFromPackageJson, removeStylelintConfigFromPackageJson, updatePackageJson } from "./config-generator";
import { ESLINT_CONFIG_FILES, FEATURE_GROUPS, FEATURES_CONFIG, GITHUB_CI_FILES, PRETTIER_CONFIG_FILES, STYLELINT_CONFIG_FILES } from "./constants";
import { detectProjectStructure } from "./framework-detection";
import { setupGitHubCIConfig } from "./github-ci-config";
import { checkForExistingGitignore, createGitignore } from "./gitignore-config";
import { setupVSCodeConfig, setupWebStormConfig } from "./ide-config";
import { checkConfigInstalled, checkEslintInstalled, detectInstalledFeatures, detectTypescriptInProject, installDependencies, validateFeatureSelection } from "./package-manager";
import { createStylelintConfig, installStylelintDependencies } from "./stylelint-config";
import { findExistingFiles } from "./utils";

const exec: (argument1: any) => Promise<any> = promisify(execCallback);

export async function runCli(): Promise<void> {
	console.clear();

	intro(color.cyan("ESLint Configuration Setup (@elsikora/eslint-config)"));

	const {
		isInstalled: hasEslint,
		version: eslintVersion,
	}: {
		isInstalled: boolean;
		version: null | string;
	} = await checkEslintInstalled();
	const { isInstalled: hasConfig }: { isInstalled: boolean; version: null | string } = await checkConfigInstalled();

	if (hasConfig) {
		const shouldUninstallOldConfig: boolean | symbol = await confirm({
			initialValue: true,
			message: "An existing ElsiKora ESLint configuration is detected. Would you like to uninstall it?",
		});

		if (!shouldUninstallOldConfig) {
			outro(color.red("Existing ElsiKora ESLint configuration detected. Setup aborted."));
			process.exit(1);
		}

		const uninstallSpinner: {
			message: (message?: string) => void;
			start: (message?: string) => void;
			stop: (message?: string, code?: number) => void;
		} = spinner();
		uninstallSpinner.start("Uninstalling existing ElsiKora ESLint configuration...");

		try {
			await exec("npm uninstall @elsikora/eslint-config eslint");
			uninstallSpinner.stop("Existing ESLint configuration uninstalled successfully!");

			// Check for existing ESLint config files
			const existingEslintConfigFiles: Array<string> = await findExistingFiles(ESLINT_CONFIG_FILES);
			const hasEslintConfigInPackageJson: boolean = await checkForEslintConfigInPackageJson();

			if (existingEslintConfigFiles.length > 0 || hasEslintConfigInPackageJson) {
				const filesList: string = existingEslintConfigFiles.join("\n- ");
				const messageLines: Array<string> = ["Existing ESLint configuration files detected:"];
				messageLines.push("");

				if (filesList) {
					messageLines.push("- " + filesList);
				}

				if (hasEslintConfigInPackageJson) {
					messageLines.push("- package.json (eslintConfig field)");
				}
				messageLines.push("", "Do you want to delete them?");

				const shouldDeleteConfigFiles: boolean | symbol = await confirm({
					initialValue: true,
					message: messageLines.join("\n"),
				});

				if (shouldDeleteConfigFiles) {
					// Delete the files
					await Promise.all(existingEslintConfigFiles.map((file: string) => fs.unlink(file)));
					// Also remove 'eslintConfig' field from package.json
					await removeEslintConfigFromPackageJson();
				}
			}
		} catch (error) {
			uninstallSpinner.stop("Failed to uninstall existing ESLint configuration");

			throw error;
		}
	}

	if (hasEslint && eslintVersion) {
		const majorVersion: number = Number.parseInt(eslintVersion.split(".")[0], 10);

		// eslint-disable-next-line @elsikora-typescript/no-magic-numbers
		if (majorVersion < 9) {
			const shouldUninstallOldEslint: boolean | symbol = await confirm({
				initialValue: true,
				message: `ESLint version ${eslintVersion} is installed, which is incompatible with this configuration.` + "\nWould you like to uninstall it and install a compatible version?",
			});

			if (!shouldUninstallOldEslint) {
				outro(color.red("Incompatible ESLint version detected. Setup aborted."));
				process.exit(1);
			}

			const uninstallSpinner: {
				message: (message?: string) => void;
				start: (message?: string) => void;
				stop: (message?: string, code?: number) => void;
			} = spinner();
			uninstallSpinner.start("Uninstalling old ESLint version...");

			try {
				await exec("npm uninstall eslint");
				uninstallSpinner.stop("Old ESLint version uninstalled successfully!");
			} catch (error) {
				uninstallSpinner.stop("Failed to uninstall old ESLint version");

				throw error;
			}
		}
	}

	const detectedFeatures: Array<TFeature> = await detectInstalledFeatures();

	let shouldUseDetected: boolean | symbol = false;

	if (detectedFeatures.length > 1) {
		shouldUseDetected = await confirm({
			initialValue: true,
			message: `Detected: ${detectedFeatures.join(", ")}. Would you like to include these features?`,
		});
	}

	const selectOptions: Array<any> = [];
	const hasTypescript: boolean = await detectTypescriptInProject();

	for (const [groupName, features] of Object.entries(FEATURE_GROUPS)) {
		selectOptions.push(new inquirer.Separator(`\n=== ${groupName} ===`));

		for (const feature of features) {
			const config: IFeatureConfig = FEATURES_CONFIG[feature];
			selectOptions.push({
				checked: feature === "javascript" || (shouldUseDetected && detectedFeatures.includes(feature as unknown as TFeature)),
				disabled: feature === "javascript" ? "Required" : config.requiresTypescript && !hasTypescript ? "Requires TypeScript" : false,
				// eslint-disable-next-line @elsikora-typescript/restrict-template-expressions
				name: `${feature} - ${config.description}`,
				value: feature,
			});
		}
	}

	const answers: any = await inquirer.prompt<{ selectedFeatures: Array<TFeature> }>([
		{
			choices: selectOptions,
			message: "Select the features you want to enable:",
			name: "selectedFeatures",
			// eslint-disable-next-line @elsikora-typescript/no-magic-numbers
			pageSize: 15,
			type: "checkbox",
			// eslint-disable-next-line @elsikora-typescript/explicit-function-return-type,@elsikora-typescript/typedef
			validate(answer) {
				if (answer.length === 0) {
					return "You must choose at least one feature.";
				}

				return true;
			},
		},
	]);

	// eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access,@elsikora-typescript/no-unsafe-assignment
	const selectedFeatures: Array<string> = answers.selectedFeatures;

	if (!selectedFeatures || selectedFeatures.length === 0) {
		outro(color.red("No features selected. Configuration aborted."));
		process.exit(1);
	}

	if (!selectedFeatures.includes("javascript")) {
		selectedFeatures.unshift("javascript");
	}

	const {
		errors,
		isValid,
	}: {
		errors: Array<string>;
		isValid: boolean;
	} = await validateFeatureSelection(selectedFeatures);

	if (!isValid) {
		outro(color.red("Configuration cannot proceed due to the following errors:"));
		errors.forEach((error: string) => {
			console.error(color.red(`- ${error}`));
		});
		process.exit(1);
	}

	const setupSpinner: {
		message: (message?: string) => void;
		start: (message?: string) => void;
		stop: (message?: string, code?: number) => void;
	} = spinner();

	try {
		// Start the spinner for ESLint configuration
		setupSpinner.start("Setting up ESLint configuration...");

		const configExtension: string = await getConfigFileExtension();

		const {
			framework,
		}: {
			customPaths: Array<string>;
			framework: IDetectedFramework | null;
		} = await detectProjectStructure();

		if (framework) {
			note([`Detected ${framework.framework.name} project structure.`, `Will configure linting for the following paths:`, ...framework.framework.lintPaths.map((path: string) => `  - ${path}`), "", "Additional ignore patterns will be added to the configuration."].join("\n"), "Framework Detection");
		}

		// eslint-disable-next-line @elsikora-typescript/no-unsafe-argument,@elsikora-typescript/no-unsafe-return,@elsikora-typescript/no-unsafe-member-access
		await installDependencies(selectOptions.map((option: any) => option.value));

		await createEslintConfig(selectedFeatures, configExtension, framework);

		// Stop the spinner before the Stylelint prompt
		setupSpinner.stop("ESLint configuration completed successfully!");

		note(["ESLint configuration has been created.", "", "Available files:", `- eslint.config${configExtension}`, "- .eslintignore", "", "You can customize the configuration in these files."].join("\n"), "ESLint Setup");

		const installStylelint: boolean | symbol = await confirm({
			initialValue: true,
			message: "Would you like to set up Stylelint for your project?",
		});

		if (installStylelint) {
			const existingStylelintConfigFiles: Array<string> = await findExistingFiles(STYLELINT_CONFIG_FILES);
			const hasStylelintConfigInPackageJson: boolean = await checkForStylelintConfigInPackageJson();

			if (existingStylelintConfigFiles.length > 0 || hasStylelintConfigInPackageJson) {
				const filesList: string = existingStylelintConfigFiles.join("\n- ");
				const messageLines: Array<string> = ["Existing Stylelint configuration files detected:"];

				messageLines.push("");

				if (filesList) {
					messageLines.push("- " + filesList);
				}

				if (hasStylelintConfigInPackageJson) {
					messageLines.push("- package.json (stylelint field)");
				}

				messageLines.push("", "Do you want to delete them?");

				const shouldDeleteStylelintConfigFiles: boolean | symbol = await confirm({
					initialValue: true,
					message: messageLines.join("\n"),
				});

				if (shouldDeleteStylelintConfigFiles) {
					await Promise.all(existingStylelintConfigFiles.map((file: string) => fs.unlink(file)));
					await removeStylelintConfigFromPackageJson();
				}
			}

			// Добавляем установку и создание конфигурации Stylelint
			setupSpinner.start("Setting up Stylelint configuration...");

			try {
				await installStylelintDependencies();
				await createStylelintConfig();
				setupSpinner.stop("Stylelint configuration completed successfully!");

				note(["Stylelint configuration has been created.", "", "Available files:", "- stylelint.config.js", "- .stylelintignore", "", "You can customize the configuration in these files."].join("\n"), "Stylelint Setup");
			} catch (error) {
				setupSpinner.stop("Failed to set up Stylelint configuration");

				throw error;
			}
		}

		if (selectedFeatures.includes("prettier")) {
			// Check for existing Prettier config files
			const existingPrettierConfigFiles: Array<string> = await findExistingFiles(PRETTIER_CONFIG_FILES);
			const hasPrettierConfigInPackageJson: boolean = await checkForPrettierConfigInPackageJson();

			if (existingPrettierConfigFiles.length > 0 || hasPrettierConfigInPackageJson) {
				const filesList: string = existingPrettierConfigFiles.join("\n- ");
				const messageLines: Array<string> = ["Existing Prettier configuration files detected:"];

				messageLines.push("");

				if (filesList) {
					messageLines.push("- " + filesList);
				}

				if (hasPrettierConfigInPackageJson) {
					messageLines.push("- package.json (prettier field)");
				}

				messageLines.push("", "Do you want to delete them?");

				const shouldDeletePrettierConfigFiles: boolean | symbol = await confirm({
					initialValue: true,
					message: messageLines.join("\n"),
				});

				if (shouldDeletePrettierConfigFiles) {
					// Delete the files
					await Promise.all(existingPrettierConfigFiles.map((file: string) => fs.unlink(file)));
					// Also remove 'prettier' field from package.json
					await removePrettierConfigFromPackageJson();
				}
			}

			setupSpinner.start("Setting up Prettier configuration...");
			await createPrettierConfig(configExtension);
			setupSpinner.stop("Prettier configuration completed successfully!");

			note(["Prettier configuration has been created.", "", "Available files:", `- prettier.config${configExtension}`, "- .prettierignore", "", "You can customize the configuration in these files."].join("\n"), "Prettier Setup");
		}

		// Continue with the rest of your script...

		const setupIdeConfigs: boolean | symbol = await confirm({
			initialValue: true,
			message: "Would you like to set up ESLint configurations for your code editor (e.g., VSCode, WebStorm)?",
		});

		if (setupIdeConfigs) {
			const ideAnswers: any = await inquirer.prompt<{ selectedIDEs: Array<string> }>([
				{
					choices: [
						{ name: "VSCode", value: "vscode" },
						{ name: "WebStorm (IntelliJ IDEA)", value: "webstorm" },
					],
					message: "Select your code editor(s):",
					name: "selectedIDEs",
					type: "checkbox",
					// eslint-disable-next-line @elsikora-typescript/explicit-function-return-type
					validate(answer: any) {
						// eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access
						if (answer.length === 0) {
							return "You must choose at least one code editor.";
						}

						return true;
					},
				},
			]);

			// eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access,@elsikora-typescript/no-unsafe-assignment
			const selectedIDEs: any = ideAnswers.selectedIDEs;

			// eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access,@elsikora-typescript/no-unsafe-call
			if (selectedIDEs.includes("vscode")) {
				await setupVSCodeConfig(selectedFeatures);
			}

			// eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access,@elsikora-typescript/no-unsafe-call
			if (selectedIDEs.includes("webstorm")) {
				await setupWebStormConfig(selectedFeatures, selectedFeatures.includes("prettier"));
			}
		}

		const setupGitHubCIResponse: boolean | symbol = await confirm({
			// eslint-disable-next-line @elsikora-typescript/naming-convention
			initialValue: true,
			message: "Would you like to set up GitHub CI workflows?",
		});
		const willSetupGitHubCI: boolean = setupGitHubCIResponse === true;
		let ciAnswers: any;
		const isNpmPackage: boolean = false;

		if (willSetupGitHubCI) {
			const isNpmPackageResponse = await confirm({
				initialValue: false,
				message: "Is this package going to be published to NPM?",
			});
			const isNpmPackage = isNpmPackageResponse === true;

			ciAnswers = await inquirer.prompt([
				{
					choices: Object.entries(GITHUB_CI_FILES).map(([key, value]) => ({
						name: `${value.name} - ${value.description}`,
						value: key,
					})),
					message: "Select the CI workflows you want to set up:",
					name: "selectedCIFiles",
					pageSize: 10,
					type: "checkbox",
				},
			]);

			if (ciAnswers.selectedCIFiles.length > 0) {
				// If dependabot is selected, ask for target branch
				let dependabotBranch = "dev";

				if (ciAnswers.selectedCIFiles.includes("DEPENDABOT")) {
					const branchAnswer = await inquirer.prompt([
						{
							default: "dev",
							message: "Enter the target branch for Dependabot updates:",
							name: "branch",
							type: "input",
						},
					]);
					dependabotBranch = branchAnswer.branch;
				}

				setupSpinner.start("Setting up GitHub CI configuration...");
				await setupGitHubCIConfig(ciAnswers.selectedCIFiles, isNpmPackage, dependabotBranch);
				setupSpinner.stop("GitHub CI configuration completed successfully!");

				// @ts-ignore
				// eslint-disable-next-line @elsikora-typescript/no-unsafe-return,@elsikora-typescript/no-unsafe-member-access
				const selectedFileNames = ciAnswers.selectedCIFiles.map((file: any) => GITHUB_CI_FILES[file].name);

				// eslint-disable-next-line @elsikora-typescript/restrict-template-expressions
				note(["GitHub CI configuration has been created.", "", "", "Created files:", ...selectedFileNames.map((name: any) => `- ${name}`), "", "", dependabotBranch !== "dev" && ciAnswers.selectedCIFiles.includes("DEPENDABOT") ? `Dependabot configured to target '${dependabotBranch}' branch` : `Dependabot configured to target 'dev' branch`, "", "", "The workflows will be activated when you push to GitHub."].filter(Boolean).join("\n"), "GitHub CI Setup");
			}
		}

		const setupChangesets: boolean | symbol = await confirm({
			initialValue: true,
			message: "Would you like to set up Changesets for version management?",
		});

		if (setupChangesets) {
			setupSpinner.start("Setting up Changesets configuration...");

			try {
				// Install changesets
				await exec("npm install -D @changesets/cli");

				// Create .changeset directory and config
				await fs.mkdir(".changeset", { recursive: true });
				await fs.writeFile(
					".changeset/config.json",
					`{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}`,
				);

				const packageJsonPath = path.resolve(process.cwd(), "package.json");
				const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
				const packageJson = JSON.parse(packageJsonContent);

				packageJson.scripts = {
					...packageJson.scripts,
					patch: "changeset",
					release: "npm install && npm run build && changeset publish",
				};

				await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

				setupSpinner.stop("Changesets configuration completed successfully!");

				note(["Changesets has been configured for your project.", "", "Available commands:", "  npm run patch     # create a new changeset", "  npm run release   # publish packages", "", "Configuration file:", "  .changeset/config.js"].join("\n"), "Changesets Setup");
			} catch (error) {
				setupSpinner.stop("Failed to set up Changesets configuration");

				throw error;
			}
		}

		const hasGitignore = await checkForExistingGitignore();
		let shouldSetupGitignore = true;

		if (hasGitignore) {
			const shouldDeleteGitignore = await confirm({
				initialValue: true,
				message: "An existing .gitignore file was found. Would you like to replace it?",
			});

			if (shouldDeleteGitignore) {
				try {
					await fs.unlink(".gitignore");
				} catch (error) {
					console.error("Error deleting existing .gitignore:", error);

					throw error;
				}
			} else {
				shouldSetupGitignore = false;
			}
		}

		if (shouldSetupGitignore) {
			setupSpinner.start("Setting up .gitignore...");

			try {
				await createGitignore();
				setupSpinner.stop(".gitignore created successfully!");

				note([".gitignore has been configured for your project.", "", "The configuration includes ignore patterns for:", "- Build outputs and dependencies", "- Common IDEs and editors", "- Testing and coverage files", "- Environment and local config files", "- System and temporary files", "- Framework-specific files", "- Lock files", "", "You can customize it further by editing .gitignore"].join("\n"), "Gitignore Setup");
			} catch (error) {
				setupSpinner.stop("Failed to create .gitignore");

				throw error;
			}
		}

		try {
			const {
				customPaths,
				framework,
			}: {
				customPaths: Array<string>;
				framework: IDetectedFramework | null;
			} = await detectProjectStructure();

			if (framework) {
				note([`Detected ${framework.framework.name} project structure.`, "Will configure linting for:", ...framework.framework.lintPaths.map((path: string) => `  - ${path}`)].join("\n"), "Framework Detection");
			}

			await updatePackageJson(framework, customPaths, selectedFeatures.includes("prettier"), installStylelint);

			const scriptDescriptions: Array<any> = [];

			// Basic lint commands
			scriptDescriptions.push("Available commands:", "  npm run lint      # check for ESLint issues", "  npm run lint:fix  # automatically fix ESLint issues");

			// Framework-specific commands
			if (framework) {
				if (framework.hasTypescript) {
					scriptDescriptions.push("  npm run lint:types # check TypeScript types", "  npm run lint:all   # run all checks (ESLint + TypeScript)");
				}

				switch (framework.framework.name) {
					case "angular": {
						scriptDescriptions.push("  npm run lint:test  # lint test files");

						break;
					}

					case "express":

					case "fastify":

					case "koa":

					case "next": {
						scriptDescriptions.push("  npm run lint:watch # watch mode: lint files on change");

						break;
					}

					case "nest": {
						scriptDescriptions.push("  npm run lint:watch # watch mode: lint files on change", "  npm run lint:test  # lint test files");

						break;
					}
				}
			}

			// Stylelint commands
			if (installStylelint) {
				scriptDescriptions.push("", "Stylelint commands:", "  npm run lint      # includes CSS/SCSS linting", "  npm run lint:fix  # includes CSS/SCSS auto-fixing");
			}

			// Prettier commands

			if (selectedFeatures.includes("prettier")) {
				scriptDescriptions.push("", "Prettier commands:", "  npm run format     # check code formatting", "  npm run format:fix # automatically format code");
			}

			if (willSetupGitHubCI) {
				scriptDescriptions.push("", "GitHub CI Workflows:");
				// Map the selected CI files to their descriptions
				// eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access
				ciAnswers.selectedCIFiles.forEach((file: TGitHubCIFile) => {
					scriptDescriptions.push(`  ${GITHUB_CI_FILES[file].name} - ${GITHUB_CI_FILES[file].description}`);
				});

				if (isNpmPackage) {
					scriptDescriptions.push("  The release workflow will automatically publish to NPM when changes are merged to main");
				}
			}

			if (setupChangesets) {
				scriptDescriptions.push("", "Changesets commands:", "  npm run patch      # create a new changeset", "  npm run release    # publish packages");
			}

			if (shouldSetupGitignore) {
				scriptDescriptions.push("", "Git configuration:", "  .gitignore has been configured with common ignore patterns", "  Including patterns for:", "    - Build outputs and dependencies", "    - IDE and editor files", "    - Testing and coverage", "    - Environment files", "    - Framework specific ignores");
			}

			if (framework) {
				// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
				note(["ESLint has been configured for your project.", `Framework: ${framework.framework.name}`, framework.hasTypescript ? "TypeScript support: enabled" : "", "", ...scriptDescriptions].filter(Boolean).join("\n"), "Configuration Summary");
			} else {
				// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
				note(["ESLint has been configured for your project.", `Linting paths: ${customPaths.join(", ")}`, "", ...scriptDescriptions].join("\n"), "Configuration Summary");
			}

			outro(color.green("✨ All done! Happy coding!"));
		} catch (error) {
			setupSpinner.stop("Failed to set up ESLint configuration");
			outro(color.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
			process.exit(1);
		}
	} catch (error) {
		setupSpinner.stop("Failed to set up ESLint configuration");
		outro(color.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
		process.exit(1);
	}
}

export default runCli;
