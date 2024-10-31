import type { Linter } from "eslint";

const pluginMap: Record<string, string> = {
	"@elsikora-react/dom": "@elsikora-react/dom",
	"@elsikora-react/hooks-extra": "@elsikora-react/hooks-extra",
	"@elsikora-react/naming-convention": "@elsikora-react/naming-convention",
	"@elsikora-react/web-api": "@elsikora-react/web-api",
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

export function formatRuleName(ruleName: string): string {
	for (const [oldName, newName] of Object.entries(pluginMap)) {
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
		// Handle plugins replacement
		if (config.plugins) {
			for (const [oldName, newName] of Object.entries(pluginMap)) {
				const pluginKey: string = oldName.startsWith("@") ? oldName : oldName;

				if (config.plugins[pluginKey]) {
					config.plugins[newName] = config.plugins[pluginKey];

					delete config.plugins[pluginKey];
				}
			}
		}

		// Handle rules replacement
		if (config.rules) {
			for (const rule of Object.keys(config.rules)) {
				for (const [oldName, newName] of Object.entries(pluginMap)) {
					const oldPrefix: string = oldName.startsWith("@") ? `${oldName}/` : `${oldName}/`;

					if (rule.startsWith(oldPrefix)) {
						const newRule: string = rule.replace(oldPrefix, `${newName}/`);
						config.rules[newRule] = config.rules[rule];

						delete config.rules[rule];
					}
				}
			}
		}

		formattedConfigs.push(config);
	}

	return formattedConfigs;
}
