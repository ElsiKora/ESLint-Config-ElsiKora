import type { Linter } from "eslint";

import eslintPluginPackageJson from "eslint-plugin-package-json/configs/recommended";

import { formatConfig } from "../utility/format-config.utility";

export default [
	{
		// @ts-ignore

		...formatConfig([eslintPluginPackageJson])[0],
		rules: {
			// @ts-ignore
			...formatConfig([eslintPluginPackageJson])[0].rules,
			"package-json/order-properties": "off",
		},
	},
] as Array<Linter.Config>;
