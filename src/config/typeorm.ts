import type { Linter } from "eslint";

import typeormTypescriptRecommended from "eslint-plugin-typeorm-typescript/recommended";
import tseslint from "typescript-eslint";

import { formatConfig } from "../utility/format";

export default [
	// @ts-ignore
	tseslint.config(...formatConfig([typeormTypescriptRecommended])[0], {
		rules: {
			"typeorm-typescript/enforce-column-types": "error",
			"typeorm-typescript/enforce-consistent-nullability": ["error", { specifyNullable: "always" }],
			"typeorm-typescript/enforce-relation-types": "error",
		},
	}),
] as Array<Linter.Config>;
