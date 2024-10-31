import typescript from '@rollup/plugin-typescript';

export default [
	{
		input: 'src/index.ts',
		external: ['@eslint/js', "@stylistic/eslint-plugin"],
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
		external: ['@eslint/js', "@stylistic/eslint-plugin"],
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
				file: 'dist/cli.js',
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
