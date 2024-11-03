import fs from "node:fs/promises";

export async function findExistingFiles(files: Array<string>): Promise<Array<string>> {
	const fileChecks: Array<Promise<string | null>> = files.map(async (file: string) => {
		try {
			await fs.access(file);
			return file;
		} catch {
			// File does not exist
			return null;
		}
	});
	const existingFiles: Array<string> = (await Promise.all(fileChecks)).filter(Boolean) as Array<string>;
	return existingFiles;
}
