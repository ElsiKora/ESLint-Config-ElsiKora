import type { Linter } from "eslint";
import type { IConfigOptions } from "../../domain/interface/config-options.interface";
/**
 * Factory class for generating ESLint configurations based on provided options.
 * Maps configuration flags to their respective module loaders and dynamically imports
 * the required config modules. Handles loading failures gracefully by logging warnings
 * and returning empty configs.
 *
 * @class ConfigFactory
 * @static
 */
export declare class ConfigFactory {
    static readonly OPTIONS_TO_CONFIG_MAP: Record<keyof IConfigOptions, string>;
    private static readonly CONFIG_MAPPING;
    static createConfig(options: IConfigOptions): Promise<Array<Linter.Config>>;
    private static loadConfig;
}
