import type { Linter } from "eslint";
export declare class ConfigMergerService {
    static mergeConfigs(configs: Array<Array<Linter.Config>>): Array<Linter.Config>;
}
