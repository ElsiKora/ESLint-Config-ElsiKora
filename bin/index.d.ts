import type { Linter } from "eslint";
import type { IConfigOptions } from "./domain/interface/config-options.interface";
export declare const createConfig: (options: IConfigOptions) => Promise<Array<Linter.Config>>;
export default createConfig;
