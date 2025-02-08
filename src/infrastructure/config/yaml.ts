import type { Linter } from "eslint";

import eslintPluginYml from "eslint-plugin-yml";

import { formatConfig } from "../utility/format-config.utility";

export default [...formatConfig([...eslintPluginYml.configs["flat/recommended"]])] as Array<Linter.Config>;
