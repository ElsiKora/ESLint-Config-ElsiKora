import fs from "node:fs/promises";
import path from "node:path";
import type { TFeature } from "./types";

export async function setupVSCodeConfig(features: Array<TFeature>): Promise<void> {
	const vscodeSettingsPath: string = path.resolve(process.cwd(), ".vscode", "settings.json");
	let settings: Record<string, any> = {};

	try {
		const existingSettings: string = await fs.readFile(vscodeSettingsPath, "utf8");
		settings = JSON.parse(existingSettings) as Record<string, any>;
	} catch {
		// File does not exist
	}

	const languages: Set<string> = new Set<string>();

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

	settings["eslint.validate"] = Array.from(languages).map((language: string) => ({
		language,
		autoFix: true,
	}));
	settings["editor.codeActionsOnSave"] = {
		"source.fixAll.eslint": true,
	};

	await fs.mkdir(path.dirname(vscodeSettingsPath), { recursive: true });
	// eslint-disable-next-line @elsikora-typescript/no-magic-numbers
	await fs.writeFile(vscodeSettingsPath, JSON.stringify(settings, null, 2), "utf-8");
}

export async function setupWebStormConfig(features: Array<TFeature>, includePrettier: boolean = false): Promise<void> {
	const webstormConfigPath: string = path.resolve(process.cwd(), ".idea", "jsLinters", "eslint.xml");
	const extensions: Set<string> = new Set<string>(["js", "ts", "jsx", "tsx", "cjs", "cts", "mjs", "mts", "html", "vue", "json", "yaml", "yml"]);

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

	const filesPattern: string = `**/*.{${Array.from(extensions).join(",")}}`;

	const xmlContent: string = `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="EslintConfiguration">
    <option name="configurationDirPath" value="$PROJECT_DIR$" />
    <option name="additionalConfig" value="--fix" />
    <files-pattern value="${filesPattern}" />
  </component>
</project>
`;

	await fs.mkdir(path.dirname(webstormConfigPath), { recursive: true });
	await fs.writeFile(webstormConfigPath, xmlContent, "utf-8");

	if (includePrettier) {
		const webstormPrettierConfigPath: string = path.resolve(process.cwd(), ".idea", "prettier.xml");
		const prettierXmlContent: string = `<?xml version="1.0" encoding="UTF-8"?>
<project version="4">
  <component name="PrettierConfiguration">
    <option name="myConfigurationMode" value="AUTOMATIC" />
  </component>
</project>
`;
		await fs.mkdir(path.dirname(webstormPrettierConfigPath), {
			recursive: true,
		});
		await fs.writeFile(webstormPrettierConfigPath, prettierXmlContent, "utf-8");
	}
}
