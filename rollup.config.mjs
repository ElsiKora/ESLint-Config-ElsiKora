import typescript from '@rollup/plugin-typescript';

export default [
	{
		input: 'src/index.ts',
		external: ['@eslint/js', "@stylistic/eslint-plugin", "eslint-plugin-check-file", "eslint-plugin-jsonc", "@eslint/compat", "eslint-plugin-ng-module-sort",
			"@elsikora/eslint-plugin-nestjs-typed", "typescript-eslint", "eslint-plugin-n", "eslint-plugin-package-json/configs/recommended", "eslint-plugin-perfectionist", "eslint-plugin-prettier/recommended",
			"@eslint-react/eslint-plugin", "eslint-plugin-regexp", "eslint-plugin-sonarjs", "eslint-plugin-tailwindcss", "eslint-plugin-typeorm-typescript/recommended", "eslint-plugin-unicorn", "eslint-plugin-yml"],
		output: {
			dir: 'dist/esm',
			format: 'esm',
			preserveModules: true
		},
		plugins: [typescript({
			outDir: 'dist/esm',
			declaration: true,
			declarationDir: 'dist/esm'
		})]
	},
	{
		input: 'src/index.ts',
		external: ['@eslint/js', "@stylistic/eslint-plugin", "eslint-plugin-check-file", "eslint-plugin-jsonc", "@eslint/compat", "eslint-plugin-ng-module-sort",
			"@elsikora/eslint-plugin-nestjs-typed", "typescript-eslint", "eslint-plugin-n", "eslint-plugin-package-json/configs/recommended", "eslint-plugin-perfectionist", "eslint-plugin-prettier/recommended",
			"@eslint-react/eslint-plugin", "eslint-plugin-regexp", "eslint-plugin-sonarjs", "eslint-plugin-tailwindcss", "eslint-plugin-typeorm-typescript/recommended", "eslint-plugin-unicorn", "eslint-plugin-yml"],
		output: {
			dir: 'dist/cjs',
			format: 'cjs',
			preserveModules: true,
			exports: 'named'
		},
		plugins: [typescript({
			outDir: 'dist/cjs',
			declaration: true,
			declarationDir: 'dist/cjs'
		})]
	},
	{
		input: 'src/cli.ts',
		output: [
			{
				file: 'bin/index.js',
				format: 'esm',
				banner: '#!/usr/bin/env node',
			},
		],
		plugins: [
			typescript({
				tsconfig: './tsconfig.json',
				declaration: true,
			}),
		],
		external: [
			'node:fs/promises',
			'node:path',
			'node:url',
			'node:util',
			'node:child_process',
			'@clack/prompts',
			'picocolors',
		],
	},
];
