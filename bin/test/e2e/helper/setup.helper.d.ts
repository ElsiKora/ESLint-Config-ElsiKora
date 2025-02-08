import { ESLint } from "eslint";
export declare function createESLintInstance(options: IConfigOptions): Promise<ESLint>;
export declare function getFixturePath(...paths: string[]): string;
