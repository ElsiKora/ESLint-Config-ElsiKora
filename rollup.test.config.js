import typescript from "@rollup/plugin-typescript";

export default [
	{
		external: [
			"@eslint/js",
			"@stylistic/eslint-plugin",
			"eslint-plugin-check-file",
			"eslint-plugin-jsonc",
			"@eslint/compat",
			"eslint-plugin-ng-module-sort",
			"@elsikora/eslint-plugin-nestjs-typed",
			"typescript-eslint",
			"eslint-plugin-n",
			"eslint-plugin-package-json/configs/recommended",
			"eslint-plugin-perfectionist",
			"eslint-plugin-prettier/recommended",
			"@eslint-react/eslint-plugin",
			"eslint-plugin-regexp",
			"eslint-plugin-sonarjs",
			"eslint-plugin-tailwindcss",
			"eslint-plugin-typeorm-typescript/recommended",
			"eslint-plugin-unicorn",
			"eslint-plugin-yml",
		],
		input: "src/index.ts",
		output: {
			dir: "dist/esm",
			format: "esm",
			preserveModules: true,
		},
		plugins: [
			typescript({
				declaration: true,
				declarationDir: "dist/esm",
				outDir: "dist/esm",
				tsconfig: "./tsconfig.build.json",
			}),
		],
	},
];
