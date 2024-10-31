import type { Linter } from "eslint";

import checkFileConfig from "./config/check-file";
import javascriptConfig from "./config/javascript";
import jsonConfig from "./config/json";
import nestConfig from "./config/nest";
import nodeConfig from "./config/node";
import packageJson from "./config/package-json";
import perfectionistConfig from "./config/perfectionist";
import prettierConfig from "./config/prettier";
import reactConfig from "./config/react";
import regExpConfig from "./config/regexp";
import sonarConfig from "./config/sonar";
import stylisticConfig from "./config/stylistic";
import tailwindCssConfig from "./config/tailwind-css";
import typeormConfig from "./config/typeorm";
import typescriptConfig from "./config/typescript";
import unicornConfig from "./config/unicorn";
import yamlConfig from "./config/yaml";

interface IConfigOptions {
	checkFile?: boolean;
	javascript?: boolean;
	json?: boolean;
	nest?: boolean;
	node?: boolean;
	packageJson?: boolean;
	perfectionist?: boolean;
	prettier?: boolean;
	react?: boolean;
	regexp?: boolean;
	sonar?: boolean;
	stylistic?: boolean;
	tailwindCss?: boolean;
	typeorm?: boolean;
	typescript?: boolean;
	unicorn?: boolean;
	yaml?: boolean;
}

export function createConfig(options: IConfigOptions = {}): Array<Linter.Config> {
	const configs: Array<Linter.Config> = [];

	if (options.javascript) {
		configs.push(...javascriptConfig);
	}

	if (options.typescript) {
		configs.push(...typescriptConfig);
	}

	if (options.perfectionist) {
		configs.push(...perfectionistConfig);
	}

	if (options.stylistic) {
		configs.push(...stylisticConfig);
	}

	if (options.checkFile) {
		configs.push(...checkFileConfig);
	}

	if (options.prettier) {
		configs.push(...prettierConfig);
	}

	if (options.unicorn) {
		configs.push(...unicornConfig);
	}

	if (options.sonar) {
		configs.push(...sonarConfig);
	}

	if (options.typeorm) {
		configs.push(...typeormConfig);
	}

	if (options.nest) {
		configs.push(...nestConfig);
	}

	if (options.node) {
		configs.push(...nodeConfig);
	}

	if (options.tailwindCss) {
		configs.push(...tailwindCssConfig);
	}

	if (options.yaml) {
		configs.push(...yamlConfig);
	}

	if (options.json) {
		configs.push(...jsonConfig);
	}

	if (options.regexp) {
		configs.push(...regExpConfig);
	}

	if (options.react) {
		configs.push(...reactConfig);
	}

	if (options.packageJson) {
		configs.push(...packageJson);
	}

	return configs as Array<Linter.Config>;
}
export default createConfig;
