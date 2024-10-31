import type { Linter } from "eslint";

import * as regexpPlugin from "eslint-plugin-regexp";

import { formatConfig } from "../utility/format";

export default [...formatConfig([regexpPlugin.configs["flat/recommended"]])] as Array<Linter.Config>;
