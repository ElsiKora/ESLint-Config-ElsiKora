import PLUGIN_MAP from "../constant/utility/plugin-map.constant";

function formatRuleName(ruleName: string): string {
	for (const [oldName, newName] of Object.entries(PLUGIN_MAP).sort((a: [string, string], b: [string, string]) => b[0].length - a[0].length)) {
		// eslint-disable-next-line @elsikora-sonar/no-all-duplicated-branches
		const oldPrefix: string = oldName.startsWith("@") ? `${oldName}/` : `${oldName}/`;

		if (ruleName.startsWith(oldPrefix)) {
			return ruleName.replace(oldPrefix, `${newName}/`);
		}
	}

	return ruleName;
}

export { formatRuleName };
