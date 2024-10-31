import type { Linter } from "eslint";

import eslintPluginPackageJson from "eslint-plugin-package-json/configs/recommended";

import { formatConfig } from "../utility/format";

export default [
	{
		// @ts-ignore

		...formatConfig([eslintPluginPackageJson])[0],
		rules: {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			...formatConfig([eslintPluginPackageJson])[0].rules,
			"package-json/order-properties": "off",
		},
	},
] as Array<Linter.Config>;
