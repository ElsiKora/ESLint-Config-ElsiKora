import type { Linter } from "eslint";

import type { IConfigOptions } from "./domain/interface/config-options.interface";

import { ConfigFactory } from "./application/factory/config.factory";

export const createConfig = (options: IConfigOptions): Promise<Array<Linter.Config>> => ConfigFactory.createConfig(options);
export default createConfig;
