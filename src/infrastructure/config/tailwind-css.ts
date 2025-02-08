import type { Linter } from "eslint";

// @ts-ignore
import tailwind from "eslint-plugin-tailwindcss";

import { formatConfig } from "../utility/format-config.utility";

export default [...formatConfig([...tailwind.configs["flat/recommended"]])] as Array<Linter.Config>;
