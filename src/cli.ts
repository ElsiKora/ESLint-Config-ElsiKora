import { exec as execCallback } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import inquirer from "inquirer";
import { confirm, intro, note, outro, spinner } from "@clack/prompts";
import color from "picocolors";

const exec = promisify(execCallback);

interface PackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	type?: string;
	scripts?: Record<string, string>;
}

interface FeatureConfig {
	packages: Array<string>;
	detect?: Array<string>;
	required?: boolean;
	description?: string;
}

const FEATURES_CONFIG: Record<string, FeatureConfig> = {
	javascript: {
		packages: [],
		required: true,
		description: "JavaScript support",
	},
	typescript: {
		packages: ["typescript-eslint"],
		detect: ["typescript", "@types/node"],
		description: "TypeScript support",
	},
	react: {
		packages: ["@eslint-react/eslint-plugin"],
		detect: ["react", "react-dom", "@types/react"],
		description: "React framework support",
	},
	nest: {
		packages: ["@elsikora/eslint-plugin-nestjs-typed", "eslint-plugin-ng-module-sort"],
		detect: ["@nestjs/core", "@nestjs/common"],
		description: "NestJS framework support",
	},
	tailwindCss: {
		packages: ["eslint-plugin-tailwindcss"],
		detect: ["tailwindcss"],
		description: "Tailwind CSS support",
	},
	prettier: {
		packages: ["eslint-config-prettier", "eslint-plugin-prettier", "prettier"],
		detect: ["prettier"],
		description: "Prettier integration",
	},
	stylistic: {
		packages: ["@stylistic/eslint-plugin"],
		description: "Stylistic rules",
	},
	sonar: {
		packages: ["eslint-plugin-sonarjs"],
		description: "SonarJS code quality rules",
	},
	unicorn: {
		packages: ["eslint-plugin-unicorn"],
		description: "Unicorn rules",
	},
	perfectionist: {
		packages: ["eslint-plugin-perfectionist"],
		description: "Code organization rules",
	},
	json: {
		packages: ["eslint-plugin-jsonc"],
		description: "JSON files support",
	},
	yaml: {
		packages: ["eslint-plugin-yml"],
		description: "YAML files support",
	},
	checkFile: {
		packages: ["eslint-plugin-check-file"],
		description: "File naming rules",
	},
	packageJson: {
		packages: ["eslint-plugin-package-json"],
		description: "package.json linting",
	},
	node: {
		packages: ["eslint-plugin-n"],
		detect: ["node", "@types/node"],
		description: "Node.js specific rules",
	},
	regexp: {
		packages: ["eslint-plugin-regexp"],
		description: "RegExp linting",
	},
	typeorm: {
		packages: ["eslint-plugin-typeorm-typescript"],
		detect: ["typeorm", "@typeorm/core"],
		description: "TypeORM support",
	},
} as const;

const FEATURE_GROUPS = {
	"Core Features": ["javascript", "typescript"],
	Frameworks: ["react", "nest"],
	Styling: ["tailwindCss", "prettier", "stylistic"],
	"Code Quality": ["sonar", "unicorn", "perfectionist"],
	"File Types": ["json", "yaml", "checkFile", "packageJson"],
	"Other Tools": ["node", "regexp", "typeorm"],
} as const;

type Feature = keyof typeof FEATURES_CONFIG;

async function checkEslintInstalled(): Promise<{
	isInstalled: boolean;
	version: string | null;
}> {
	try {
		const { stdout } = await exec("npm ls eslint --depth=0 --json");
		const npmList = JSON.parse(stdout);
		const eslintVersion = npmList.dependencies.eslint.version;
		return { isInstalled: true, version: eslintVersion };
	} catch {
		return { isInstalled: false, version: null };
	}
}

async function checkConfigInstalled(): Promise<{
	isInstalled: boolean;
	version: string | null;
}> {
	try {
		const { stdout } = await exec("npm ls @elsikora/eslint-config --depth=0 --json");
		const npmList = JSON.parse(stdout);
		const eslintVersion = npmList.dependencies["@elsikora/eslint-config"].version;
		return { isInstalled: true, version: eslintVersion };
	} catch {
		return { isInstalled: false, version: null };
	}
}

async function detectInstalledFeatures(): Promise<Array<Feature>> {
	try {
		const packageJsonPath = path.resolve(process.cwd(), "package.json");
		const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
		const packageJson: PackageJson = JSON.parse(packageJsonContent);

		const allDependencies = {
			...packageJson.dependencies,
			...packageJson.devDependencies,
		};

		const detectedFeatures = new Set<Feature>();

		Object.entries(FEATURES_CONFIG).forEach(([feature, config]) => {
			if (config.required) {
				detectedFeatures.add(feature);
			}
		});

		Object.entries(FEATURES_CONFIG).forEach(([feature, config]) => {
			if (config.detect) {
				const isDetected = config.detect.some((pkg) => !!allDependencies[pkg]);
				if (isDetected) {
					detectedFeatures.add(feature);
				}
			}
		});

		return Array.from(detectedFeatures);
	} catch {
		return ["javascript"] as Array<Feature>;
	}
}

async function installDependencies(features: Array<Feature>) {
	const depsToInstall = new Set<string>();
	depsToInstall.add("@elsikora/eslint-config");
	depsToInstall.add("@eslint/js");
	depsToInstall.add("@eslint/compat");
	depsToInstall.add("@types/eslint__js");
	depsToInstall.add("typescript-eslint");
	depsToInstall.add("@eslint-react/eslint-plugin");
	depsToInstall.add("@elsikora/eslint-plugin-nestjs-typed");
	depsToInstall.add("eslint-plugin-ng-module-sort");
	depsToInstall.add("eslint-config-prettier");
	depsToInstall.add("eslint-plugin-prettier");
	depsToInstall.add("prettier");
	depsToInstall.add("@stylistic/eslint-plugin");
	depsToInstall.add("eslint-plugin-sonarjs");
	depsToInstall.add("eslint-plugin-unicorn");
	depsToInstall.add("eslint-plugin-perfectionist");
	depsToInstall.add("eslint-plugin-jsonc");
	depsToInstall.add("eslint-plugin-yml");
	depsToInstall.add("eslint-plugin-check-file");
	depsToInstall.add("eslint-plugin-package-json");
	depsToInstall.add("eslint-plugin-n");
	depsToInstall.add("eslint-plugin-regexp");
	depsToInstall.add("eslint-plugin-typeorm-typescript");

	for (const feature of features) {
		const config = FEATURES_CONFIG[feature];
		if (config && config.packages) {
			config.packages.forEach((pkg) => depsToInstall.add(pkg));
		}
	}

	const installSpinner = spinner();
	installSpinner.start("Installing ESLint dependencies...");

	try {
		const depsArray = [...depsToInstall];
		await exec(`npm install -D ${depsArray.join(" ")}`);
		installSpinner.stop("ESLint dependencies installed successfully!");
	} catch (error) {
		installSpinner.stop("Failed to install ESLint dependencies");
		throw error;
	}
}

async function getConfigFileExtension(): Promise<".js" | ".cjs" | ".mjs"> {
	try {
		const packageJsonPath = path.resolve(process.cwd(), "package.json");
		const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
		const packageJson: PackageJson = JSON.parse(packageJsonContent);

		const isModule = packageJson.type === "module";

		if (isModule) {
			return ".js";
		} else {
			return ".cjs";
		}
	} catch {
		return ".js";
	}
}

async function createEslintConfig(features: Array<Feature>, extension: string) {
	const configContent = `import createConfig from '@elsikora/eslint-config';

export default createConfig({
${features.map((feature) => `  ${feature}: true`).join(",\n")}
});
`;

	await fs.writeFile(`eslint.config${extension}`, configContent, "utf-8");
}

async function createPrettierConfig(extension: string) {
	const prettierConfigContent: string = `export default {
  useTabs: true,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  bracketSameLine: true,
  arrowParens: "always",
  printWidth: 480,
  proseWrap: "never",
};
`;

	await fs.writeFile(`prettier.config${extension}`, prettierConfigContent, "utf-8");

	const prettierIgnoreContent = `node_modules
dist
build
`;

	await fs.writeFile(".prettierignore", prettierIgnoreContent, "utf-8");
}

async function updatePackageJson(includeStylelint: boolean = false, includePrettier: boolean = false) {
	try {
		const packageJsonPath = path.resolve(process.cwd(), "package.json");
		const packageJsonContent = await fs.readFile(packageJsonPath, "utf8");
		const packageJson = JSON.parse(packageJsonContent);

		packageJson.type = "module";

		const lintCommand = includeStylelint
			? 'eslint . ; npx stylelint "**/*.{css,scss}"'
			: 'eslint .';

		const lintFixCommand = includeStylelint
			? 'eslint . --fix ; npx stylelint "**/*.{css,scss}" --fix'
			: 'eslint . --fix';

		const scripts: Record<string, string> = {
			...packageJson.scripts,
			lint: lintCommand,
			"lint:fix": lintFixCommand,
		};

		if (includePrettier) {
			scripts.format = "prettier --check .";
			scripts["format:fix"] = "prettier --write .";
		}

		packageJson.scripts = scripts;

		await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n", "utf-8");
	} catch (error) {
		throw new Error(`Failed to update package.json: ${error}`);
	}
}

async function setupVSCodeConfig(features: Array<Feature>) {
	const vscodeSettingsPath = path.resolve(process.cwd(), ".vscode", "settings.json");
	let settings: any = {};

	// Read existing settings.json if it exists
	try {
		const existingSettings = await fs.readFile(vscodeSettingsPath, "utf8");
		settings = JSON.parse(existingSettings);
	} catch {
		// File does not exist, start with empty settings
	}

	// Collect language IDs based on selected features
	const languages = new Set<string>();

	if (features.includes("javascript")) {
		languages.add("javascript");
		languages.add("javascriptreact");
	}

	if (features.includes("typescript")) {
		languages.add("typescript");
		languages.add("typescriptreact");
	}

	if (features.includes("json")) {
		languages.add("json");
		languages.add("jsonc");
	}

	if (features.includes("yaml")) {
		languages.add("yaml");
		languages.add("yml");
	}

	if (features.includes("react")) {
		languages.add("javascriptreact");
		languages.add("typescriptreact");
	}

	// Update ESLint validate settings
	settings["eslint.validate"] = Array.from(languages).map((language) => ({
		language,
		autoFix: true,
	}));

	// Enable auto-fix on save
	settings["editor.codeActionsOnSave"] = {
		"source.fixAll.eslint": true,
	};

	// Create .vscode directory if it doesn't exist
	await fs.mkdir(path.dirname(vscodeSettingsPath), { recursive: true });

	// Write settings.json
	await fs.writeFile(vscodeSettingsPath, JSON.stringify(settings, null, 2), "utf-8");
}

async function setupWebStormConfig(features: Array<Feature>) {
	const webstormConfigPath = path.resolve(process.cwd(), ".idea", "jsLinters", "eslint.xml");

	// Collect file extensions based on selected features
	const extensions = new Set<string>(["js", "ts", "jsx", "tsx", "cjs", "cts", "mjs", "mts", "html", "vue", "json", "yaml", "yml"]);

	if (!features.includes("react")) {
		extensions.delete("jsx");
		extensions.delete("tsx");
	}

	if (!features.includes("typescript")) {
		extensions.delete("ts");
		extensions.delete("cts");
		extensions.delete("mts");
	}

	if (!features.includes("json")) {
		extensions.delete("json");
	}

	if (!features.includes("yaml")) {
		extensions.delete("yaml");
		extensions.delete("yml");
	}

	// Combine extensions into pattern
	const filesPattern = `**/*.{${Array.from(extensions).join(",")}}`;

	// Build the XML content
	const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="EslintConfiguration">
    <option name="configurationDirPath" value="$PROJECT_DIR$" />
    <option name="additionalConfig" value="--fix" />
    <files-pattern value="${filesPattern}" />
  </component>
</project>
`;

	// Create directories if they don't exist
	await fs.mkdir(path.dirname(webstormConfigPath), { recursive: true });

	// Write the eslint.xml file
	await fs.writeFile(webstormConfigPath, xmlContent, "utf-8");
}

async function installStylelintDependencies() {
	const stylelintDeps = ["stylelint@^16.10.0", "stylelint-config-css-modules@^4.4.0", "stylelint-config-rational-order@^0.1.2", "stylelint-config-standard-scss@^13.1.0", "stylelint-order@^6.0.4", "stylelint-prettier@^5.0.2"];

	const installSpinner = spinner();
	installSpinner.start("Installing Stylelint dependencies...");

	try {
		await exec(`npm install -D ${stylelintDeps.join(" ")}`);
		installSpinner.stop("Stylelint dependencies installed successfully!");
	} catch (error) {
		installSpinner.stop("Failed to install Stylelint dependencies");
		throw error;
	}
}

async function createStylelintConfig() {
	const stylelintConfigContent = `
export default {
    extends: [
        "stylelint-config-standard-scss",
        "stylelint-config-rational-order",
        "stylelint-prettier/recommended",
        "stylelint-config-css-modules",
    ],
    plugins: [
        "stylelint-order",
        "stylelint-config-rational-order/plugin",
        "stylelint-prettier",
    ],
    defaultSeverity: "warning",
    rules: {
        "prettier/prettier": [
            true,
            {
                endOfLine: "auto",
            },
        ],
        "scss/at-mixin-argumentless-call-parentheses": "always",
        "scss/dollar-variable-empty-line-before": null,
        "selector-class-pattern": null,
        "no-descending-specificity": null,
        "shorthand-property-no-redundant-values": null,
        "declaration-block-no-redundant-longhand-properties": null,
        "property-no-vendor-prefix": null,
        "at-rule-no-vendor-prefix": null,
        "value-no-vendor-prefix": null,
        "value-keyword-case": null,
        "color-hex-length": null,
        "alpha-value-notation": ["number"],
        "color-function-notation": ["modern"],
        "function-url-quotes": "never",
        "number-max-precision": 5,
        "hue-degree-notation": ["number"],
        "media-feature-range-notation": "prefix",
        "declaration-block-no-shorthand-property-overrides": [
            true,
            {
                severity: "error",
            },
        ],
        "no-duplicate-selectors": [
            true,
            {
                disallowInList: false,
                severity: "error",
            },
        ],
        "declaration-block-no-duplicate-properties": [
            true,
            {
                ignore: ["consecutive-duplicates"],
                severity: "error",
            },
        ],
        "keyframes-name-pattern": [
            "^[a-z][a-zA-Z0-9]+$",
            {
                severity: "error",
                message: "You should use camelCase",
            },
        ],
        "selector-type-no-unknown": [
            true,
            {
                ignoreTypes: ["disabled"],
            },
        ],
        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: ["include", "mixin", "extend", "use"],
            },
        ],
        "selector-pseudo-element-no-unknown": [
            true,
            {
                ignorePseudoElements: ["input-placeholder"],
            },
        ],
        "selector-no-vendor-prefix": [
            true,
            {
                ignoreSelectors: ["::-webkit-input-placeholder", "/-moz-.*/", "/-ms-.*/"],
            },
        ],
    },
};
`;

	await fs.writeFile("stylelint.config.js", stylelintConfigContent, "utf-8");

	// Create .stylelintignore file
	const stylelintIgnoreContent = `node_modules
dist
build
`;

	await fs.writeFile(".stylelintignore", stylelintIgnoreContent, "utf-8");
}

export async function runCli() {
	console.clear();

	intro(color.cyan("ESLint Configuration Setup (@elsikora/eslint-config)"));

	const { isInstalled: hasEslint, version: eslintVersion } = await checkEslintInstalled();
	const { isInstalled: hasConfig } = await checkConfigInstalled();

	if (hasConfig) {
		const shouldUninstallOldConfig = await confirm({
			initialValue: true,
			message: "An existing ESLint configuration is detected. Would you like to uninstall it?",
		});

		if (!shouldUninstallOldConfig) {
			outro(color.red("Existing ESLint configuration detected. Setup aborted."));
			process.exit(1);
		}

		const uninstallSpinner = spinner();
		uninstallSpinner.start("Uninstalling existing ESLint configuration...");

		try {
			await exec("npm uninstall @elsikora/eslint-config eslint");
			uninstallSpinner.stop("Existing ESLint configuration uninstalled successfully!");
		} catch (error) {
			uninstallSpinner.stop("Failed to uninstall existing ESLint configuration");
			throw error;
		}
	}

	if (hasEslint && eslintVersion) {
		const majorVersion = parseInt(eslintVersion.split(".")[0], 10);
		if (majorVersion < 9) {
			const shouldUninstallOldEslint = await confirm({
				initialValue: true,
				message: `ESLint version ${eslintVersion} is installed, which is incompatible with this configuration.` + "\nWould you like to uninstall it and install a compatible version?",
			});

			if (!shouldUninstallOldEslint) {
				outro(color.red("Incompatible ESLint version detected. Setup aborted."));
				process.exit(1);
			}

			const uninstallSpinner = spinner();
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

	const detectedFeatures = await detectInstalledFeatures();

	let shouldUseDetected = false;
	if (detectedFeatures.length > 1) {
		// @ts-ignore
		shouldUseDetected = await confirm({
			initialValue: true,
			message: `Detected: ${detectedFeatures.join(", ")}. Would you like to include these features?`,
		});
	}

	// Create options for Inquirer prompt with grouping
	// @ts-ignore
	const selectOptions: Array<inquirer.DistinctChoice<inquirer.CheckboxChoiceMap>> = [];

	for (const [groupName, features] of Object.entries(FEATURE_GROUPS)) {
		selectOptions.push(new inquirer.Separator(`\n=== ${groupName} ===`));
		for (const feature of features) {
			const config = FEATURES_CONFIG[feature];
			selectOptions.push({
				name: `${feature} - ${config.description}`,
				value: feature as Feature,
				checked: feature === "javascript" || (shouldUseDetected && detectedFeatures.includes(feature as Feature)),
				disabled: feature === "javascript" ? "Required" : false,
			});
		}
	}

	const answers = await inquirer.prompt<{ selectedFeatures: Array<Feature> }>([
		{
			type: "checkbox",
			name: "selectedFeatures",
			message: "Select the features you want to enable:",
			choices: selectOptions,
			pageSize: 15,
			validate(answer) {
				if (answer.length < 1) {
					return "You must choose at least one feature.";
				}
				return true;
			},
		},
	]);

	const selectedFeatures = answers.selectedFeatures;

	if (!selectedFeatures || selectedFeatures.length === 0) {
		outro(color.red("No features selected. Configuration aborted."));
		process.exit(1);
	}

	// Ensure that javascript is always included
	if (!selectedFeatures.includes("javascript")) {
		selectedFeatures.unshift("javascript");
	}

	const setupSpinner = spinner();

	try {
		setupSpinner.start("Setting up ESLint configuration...");

		const configExtension = await getConfigFileExtension();

		await installDependencies(selectedFeatures);
		await createEslintConfig(selectedFeatures, configExtension);
		const installStylelint = await confirm({
			initialValue: true,
			message: "Would you like to set up Stylelint for your project?",
		});

		await updatePackageJson(installStylelint, selectedFeatures.includes("prettier"));

		if (installStylelint) {
			await installStylelintDependencies();
			await createStylelintConfig();

			note(["Stylelint configuration has been created.", "", "You can customize it in your stylelint.config.js file."].join("\n"), "Stylelint Setup");
		}

		if (selectedFeatures.includes("prettier")) {
			await createPrettierConfig(configExtension);
		}

		setupSpinner.stop("ESLint configuration completed successfully!");

		// Prompt to set up IDE configurations
		const setupIdeConfigs = await confirm({
			initialValue: true,
			message: "Would you like to set up ESLint configurations for your code editor (e.g., VSCode, WebStorm)?",
		});

		if (setupIdeConfigs) {
			const ideAnswers = await inquirer.prompt<{ selectedIDEs: Array<string> }>([
				{
					type: "checkbox",
					name: "selectedIDEs",
					message: "Select your code editor(s):",
					choices: [
						{ name: "VSCode", value: "vscode" },
						{ name: "WebStorm (IntelliJ IDEA)", value: "webstorm" },
					],
					validate(answer) {
						if (answer.length < 1) {
							return "You must choose at least one code editor.";
						}
						return true;
					},
				},
			]);

			const selectedIDEs = ideAnswers.selectedIDEs;

			if (selectedIDEs.includes("vscode")) {
				await setupVSCodeConfig(selectedFeatures);
			}

			if (selectedIDEs.includes("webstorm")) {
				await setupWebStormConfig(selectedFeatures);
			}
		}

		if (selectedFeatures.includes("prettier")) {
			note(["Prettier configuration has been created.", "", "You can customize it in your prettier configuration file."].join("\n"), "Prettier Setup");
		}

		const scriptsList = [];
		const runCommands = [];

		if (installStylelint) {
			scriptsList.push('  "lint": "eslint . ; npx stylelint \\"**/*.{css,scss}\\""');
			scriptsList.push('  "lint:fix": "eslint . --fix ; npx stylelint \\"**/*.{css,scss}\\" --fix"');
			runCommands.push("  npm run lint      # to check for ESLint and Stylelint issues");
			runCommands.push("  npm run lint:fix  # to fix ESLint and Stylelint issues");
		} else {
			scriptsList.push('  "lint": "eslint ."');
			scriptsList.push('  "lint:fix": "eslint . --fix"');
			runCommands.push("  npm run lint      # to check for ESLint issues");
			runCommands.push("  npm run lint:fix  # to fix ESLint issues");
		}

		// Add Prettier format commands if enabled
		if (selectedFeatures.includes("prettier")) {
			scriptsList.push('  "format": "prettier --check ."');
			scriptsList.push('  "format:fix": "prettier --write ."');
			runCommands.push("  npm run format    # to check formatting with Prettier");
			runCommands.push("  npm run format:fix # to fix formatting with Prettier");
		}

		note(
			[
				"ESLint configuration is ready!",
				"",
				"Added scripts to package.json:",
				...scriptsList,
				"",
				"You can now run:",
				...runCommands,
			].join("\n"),
			"Next steps"
		);

		outro(color.green("✨ All done! Happy coding!"));
	} catch (error) {
		setupSpinner.stop("Failed to set up ESLint configuration");
		outro(color.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
		process.exit(1);
	}
}

runCli().catch(console.error);

export default runCli;
