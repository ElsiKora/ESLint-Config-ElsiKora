import type { Linter } from "eslint";

import eslintPluginYml from "eslint-plugin-yml";

import { formatConfig } from "../utility/format";
export default [...formatConfig([...eslintPluginYml.configs["flat/recommended"]])] as Array<Linter.Config>;
