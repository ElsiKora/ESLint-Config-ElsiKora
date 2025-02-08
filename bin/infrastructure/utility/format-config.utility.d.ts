import type { Linter } from "eslint";
/**
 * Formats ESLint configurations by remapping plugin names and rule prefixes according to PLUGIN_MAP.
 * @param configs - Array of ESLint flat configurations to process
 * @returns Array of formatted ESLint configurations with updated plugin names and rule prefixes
 */
declare function formatConfig(configs: Array<Linter.Config>): Array<Linter.Config>;
export { formatConfig };
