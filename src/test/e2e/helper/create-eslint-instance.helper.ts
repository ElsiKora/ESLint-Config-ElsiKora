import { IConfigOptions } from "../../../domain/interface/config-options.interface";
import { ESLint, Linter } from "eslint";
import createConfig from "../../../../dist/esm/index";

export async function createEsLintInstance(options: IConfigOptions): Promise<ESLint> {
	const config: Array<Linter.Config> = await createConfig(options);

	return new ESLint({
		overrideConfigFile: true,
		baseConfig: config,
	});
}
