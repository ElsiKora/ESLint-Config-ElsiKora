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
	withCheckFile?: boolean;
	withJavascript?: boolean;
	withJson?: boolean;
	withNest?: boolean;
	withNode?: boolean;
	withPackageJson?: boolean;
	withPerfectionist?: boolean;
	withPrettier?: boolean;
	withReact?: boolean;
	withRegexp?: boolean;
	withSonar?: boolean;
	withStylistic?: boolean;
	withTailwindCss?: boolean;
	withTypeorm?: boolean;
	withTypescript?: boolean;
	withUnicorn?: boolean;
	withYaml?: boolean;
}

export function createConfig(options: IConfigOptions = {}): Array<Linter.Config> {
	const configs: Array<Linter.Config> = [];

	if (options.withJavascript) {
		configs.push(...javascriptConfig);
	}

	if (options.withTypescript) {
		configs.push(...typescriptConfig);
	}

	if (options.withPerfectionist) {
		configs.push(...perfectionistConfig);
	}

	if (options.withStylistic) {
		configs.push(...stylisticConfig);
	}

	if (options.withCheckFile) {
		configs.push(...checkFileConfig);
	}

	if (options.withPrettier) {
		configs.push(...prettierConfig);
	}

	if (options.withUnicorn) {
		configs.push(...unicornConfig);
	}

	if (options.withSonar) {
		configs.push(...sonarConfig);
	}

	if (options.withTypeorm) {
		configs.push(...typeormConfig);
	}

	if (options.withNest) {
		configs.push(...nestConfig);
	}

	if (options.withNode) {
		configs.push(...nodeConfig);
	}

	if (options.withTailwindCss) {
		configs.push(...tailwindCssConfig);
	}

	if (options.withYaml) {
		configs.push(...yamlConfig);
	}

	if (options.withJson) {
		configs.push(...jsonConfig);
	}

	if (options.withRegexp) {
		configs.push(...regExpConfig);
	}

	if (options.withReact) {
		configs.push(...reactConfig);
	}

	if (options.withPackageJson) {
		configs.push(...packageJson);
	}

	return configs;
}
export default createConfig;
