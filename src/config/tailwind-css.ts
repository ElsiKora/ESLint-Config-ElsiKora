import type { Linter } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import tailwind from "eslint-plugin-tailwindcss";

import { formatConfig } from "../utility/format";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
export default [...formatConfig([...tailwind.configs["flat/recommended"]])] as Array<Linter.Config>;
