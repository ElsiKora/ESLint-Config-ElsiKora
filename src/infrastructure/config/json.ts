import type { Linter } from "eslint";

import eslintPluginJsonc from "eslint-plugin-jsonc";

import { formatConfig } from "../utility/format";
export default [...formatConfig([...eslintPluginJsonc.configs["flat/recommended-with-jsonc"]])] as Array<Linter.Config>;
