import type { Linter } from "eslint";

export interface IConfig {
	getConfig(): Promise<Array<Linter.Config>>;
}
