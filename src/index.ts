import type { Linter } from "eslint";

interface IConfigOptions {
	checkFile?: boolean;
	javascript?: boolean;
	json?: boolean;
	nest?: boolean;
	node?: boolean;
	packageJson?: boolean;
	perfectionist?: boolean;
	prettier?: boolean;
	react?: boolean;
	regexp?: boolean;
	sonar?: boolean;
	stylistic?: boolean;
	tailwindCss?: boolean;
	typeorm?: boolean;
	typescript?: boolean;
	unicorn?: boolean;
	yaml?: boolean;
}

async function loadConfig(name: string): Promise<Array<Linter.Config>> {
	try {
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment,@elsikora-typescript/typedef
		const config = await import(`./config/${name}`);
		// eslint-disable-next-line @elsikora-typescript/no-unsafe-member-access,@elsikora-typescript/no-unsafe-return
		return config.default;
	} catch {
		console.warn(`Failed to load config for ${name}. Make sure the corresponding package is installed.`);
		return [];
	}
}

export async function createConfig(options: IConfigOptions = {}): Promise<Array<Linter.Config>> {
	const configPromises: Array<Promise<Array<Linter.Config>>> = [];

	const configMap: Record<keyof IConfigOptions, string> = {
		javascript: "javascript",
		typescript: "typescript",
		perfectionist: "perfectionist",
		stylistic: "stylistic",
		checkFile: "check-file",
		prettier: "prettier",
		unicorn: "unicorn",
		sonar: "sonar",
		typeorm: "typeorm",
		nest: "nest",
		node: "node",
		tailwindCss: "tailwind-css",
		yaml: "yaml",
		json: "json",
		regexp: "regexp",
		react: "react",
		packageJson: "package-json",
	};

	for (const [key, value] of Object.entries(configMap)) {
		if (options[key as keyof IConfigOptions]) {
			configPromises.push(loadConfig(value));
		}
	}

	const configs: Array<Awaited<Array<Linter.Config>>> = await Promise.all(configPromises);
	return configs.flat();
}

export default createConfig;
