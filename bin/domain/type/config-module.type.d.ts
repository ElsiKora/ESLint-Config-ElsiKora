import type { Linter } from "eslint";
export type TConfigModule = {
    default: Array<Linter.Config>;
};
