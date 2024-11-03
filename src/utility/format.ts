import type { Linter } from "eslint";

const pluginMap: Record<string, string> = {
	"@eslint-react/dom": "@elsikora-react/dom",
	"@eslint-react/hooks-extra": "@elsikora-react/hooks-extra",
	"@eslint-react/naming-convention": "@elsikora-react/naming-convention",
	"@eslint-react/web-api": "@elsikora-react/web-api",
	"@eslint-react": "@elsikora-react",
	"@stylistic": "@elsikora-stylistic",
	"@typescript-eslint": "@elsikora-typescript",
	"check-file": "@elsikora-check-file",
	jsonc: "elsikora-json",
	n: "elsikora-node",
	"package-json": "@elsikora-package-json",
	perfectionist: "@elsikora-perfectionist",
	prettier: "@elsikora-prettier",
	sonarjs: "@elsikora-sonar",
	unicorn: "@elsikora-unicorn",
};

const sortedPluginEntries = Object.entries(pluginMap)
	.sort((a, b) => b[0].length - a[0].length);

export function formatRuleName(ruleName: string): string {
	for (const [oldName, newName] of sortedPluginEntries) {
		const oldPrefix: string = oldName.startsWith("@") ? `${oldName}/` : `${oldName}/`;

		if (ruleName.startsWith(oldPrefix)) {
			return ruleName.replace(oldPrefix, `${newName}/`);
		}
	}

	return ruleName;
}

export function formatConfig(configs: Array<Linter.Config>): Array<Linter.Config> {
	const formattedConfigs: Array<Linter.Config> = [];

	for (const config of configs) {
		if (config.plugins) {
			for (const [oldName, newName] of sortedPluginEntries) {
				const pluginKey: string = oldName.startsWith("@") ? oldName : oldName;

				if (config.plugins[pluginKey]) {
					config.plugins[newName] = config.plugins[pluginKey];

					delete config.plugins[pluginKey];
				}
			}
		}

		if (config.rules) {
			for (const rule of Object.keys(config.rules)) {
				let replaced = false;

				for (const [oldName, newName] of sortedPluginEntries) {
					const oldPrefix: string = oldName.startsWith("@") ? `${oldName}/` : `${oldName}/`;

					if (rule.startsWith(oldPrefix) && !replaced) {
						const newRule: string = rule.replace(oldPrefix, `${newName}/`);
						config.rules[newRule] = config.rules[rule];

						delete config.rules[rule];
						replaced = true;
						break;
					}
				}
			}
		}

		formattedConfigs.push(config);
	}

	return formattedConfigs;
}
