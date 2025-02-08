import type { Linter } from "eslint";

import typeormTypescriptRecommended from "eslint-plugin-typeorm-typescript/recommended";
import tseslint from "typescript-eslint";

import { formatConfig } from "../utility/format";

export default tseslint.config({
	// @ts-ignore
	extends: [...formatConfig([typeormTypescriptRecommended])],
	rules: {
		"typeorm-typescript/enforce-column-types": "error",
		"typeorm-typescript/enforce-consistent-nullability": ["error", { specifyNullable: "always" }],
		"typeorm-typescript/enforce-relation-types": "error",
	},
}) as Array<Linter.Config>;
