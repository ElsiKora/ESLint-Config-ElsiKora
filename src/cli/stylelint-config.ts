import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";

const exec: (arg1: any) => Promise<any> = promisify(execCallback);

export async function installStylelintDependencies(): Promise<void> {
	const stylelintDeps: Array<string> = ["stylelint@^16.10.0", "stylelint-config-css-modules@^4.4.0", "stylelint-config-rational-order@^0.1.2", "stylelint-config-standard-scss@^13.1.0", "stylelint-order@^6.0.4", "stylelint-prettier@^5.0.2"];
	await exec(`npm install -D ${stylelintDeps.join(" ")}`);
}

export async function createStylelintConfig(): Promise<void> {
	const stylelintConfigContent: string = `
export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-rational-order',
    'stylelint-prettier/recommended',
    'stylelint-config-css-modules',
  ],
  plugins: [
    'stylelint-order',
    'stylelint-config-rational-order/plugin',
    'stylelint-prettier',
  ],
  defaultSeverity: 'warning',
};
`;
	await fs.writeFile("stylelint.config.js", stylelintConfigContent, "utf-8");

	const stylelintIgnoreContent: string = `node_modules
dist
build
`;
	await fs.writeFile(".stylelintignore", stylelintIgnoreContent, "utf-8");
}
