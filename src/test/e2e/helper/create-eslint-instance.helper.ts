import { IConfigOptions } from "../../../domain/interface/config-options.interface";
import { ESLint } from "eslint";
import createConfig from "../../../index";
import tseslint from "typescript-eslint";

export async function createEsLintInstance(options: IConfigOptions): Promise<ESLint> {
	const config = await createConfig(options);

	return new ESLint({
		baseConfig: tseslint.config({
			// ...
			languageOptions: {
				parserOptions: {
					project: "./tsconfig.test.json",
					tsconfigRootDir: "/Users/keenestcallas/WebstormProjects/ESLint-Config/",
				},
			},
			// ...
		})[0],
	});
}
