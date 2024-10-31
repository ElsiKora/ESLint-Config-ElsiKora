import type { Linter } from "eslint";

import prettier from "eslint-plugin-prettier/recommended";

import { formatConfig } from "../utility/format";

export default [...formatConfig([prettier])] as Array<Linter.Config>;
