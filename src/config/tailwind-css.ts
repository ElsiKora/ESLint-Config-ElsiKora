import type { Linter } from "eslint";
// @ts-ignore
import tailwind from "eslint-plugin-tailwindcss";

import { formatConfig } from "../utility/format";

// eslint-disable-next-line @elsikora-typescript/no-unsafe-argument,@elsikora-typescript/no-unsafe-assignment,@elsikora-typescript/no-unsafe-member-access
export default [...formatConfig([...tailwind.configs["flat/recommended"]])] as Array<Linter.Config>;
