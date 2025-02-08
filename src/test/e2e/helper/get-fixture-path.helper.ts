import path from "node:path";

export function getFixturePath(...paths: string[]): string {
	return path.join(__dirname, "../fixture", ...paths);
}
