import type { Linter } from "eslint";

import type { IConfigOptions } from "../../domain/interface/config-options.interface";
import type { TConfigLoader } from "../../domain/type/config-loader.type";
import type { TConfigModule } from "../../domain/type/config-module.type";

/**
 * Factory class for generating ESLint configurations based on provided options.
 * Maps configuration flags to their respective module loaders and dynamically imports
 * the required config modules. Handles loading failures gracefully by logging warnings
 * and returning empty configs.
 *
 * @class ConfigFactory
 * @static
 */
export class ConfigFactory {
	static readonly OPTIONS_TO_CONFIG_MAP: Record<keyof IConfigOptions, string> = {
		withCheckFile: "check-file",
		withJavascript: "javascript",
		withJson: "json",
		withNest: "nest",
		withNode: "node",
		withPackageJson: "package-json",
		withPerfectionist: "perfectionist",
		withPrettier: "prettier",
		withReact: "react",
		withRegexp: "regexp",
		withSonar: "sonar",
		withStylistic: "stylistic",
		withTailwindCss: "tailwind-css",
		withTypeorm: "typeorm",
		withTypescript: "typescript",
		withUnicorn: "unicorn",
		withYaml: "yaml",
	};

	private static readonly CONFIG_MAPPING: Record<string, TConfigLoader> = {
		"check-file": () => import("../../infrastructure/config/check-file"),
		javascript: () => import("../../infrastructure/config/javascript"),
		json: () => import("../../infrastructure/config/json"),
		nest: () => import("../../infrastructure/config/nest"),
		node: () => import("../../infrastructure/config/node"),
		"package-json": () => import("../../infrastructure/config/package-json"),
		perfectionist: () => import("../../infrastructure/config/perfectionist"),
		prettier: () => import("../../infrastructure/config/prettier"),
		react: () => import("../../infrastructure/config/react"),
		regexp: () => import("../../infrastructure/config/regexp"),
		sonar: () => import("../../infrastructure/config/sonar"),
		stylistic: () => import("../../infrastructure/config/stylistic"),
		"tailwind-css": () => import("../../infrastructure/config/tailwind-css"),
		typeorm: () => import("../../infrastructure/config/typeorm"),
		typescript: () => import("../../infrastructure/config/typescript"),
		unicorn: () => import("../../infrastructure/config/unicorn"),
		yaml: () => import("../../infrastructure/config/yaml"),
	};

	static async createConfig(options: IConfigOptions): Promise<Array<Linter.Config>> {
		const configPromises: Array<Promise<Array<Linter.Config>>> = Object.entries(options)
			.filter(([key, value]) => value === true && this.OPTIONS_TO_CONFIG_MAP[key as keyof IConfigOptions])
			.map(([key]) => {
				const configName: string | undefined = this.OPTIONS_TO_CONFIG_MAP[key as keyof IConfigOptions];

				return this.loadConfig(configName);
			});

		const config: Array<Awaited<Array<Linter.Config>>> = await Promise.all(configPromises);

		return config.flat();
	}

	private static async loadConfig(name: string): Promise<Array<Linter.Config>> {
		try {
			const module: TConfigModule = await this.CONFIG_MAPPING[name]();

			return module.default;
		} catch (error) {
			console.warn(`Optional dependency for ${name} config is not installed:`, error);

			return [];
		}
	}
}
