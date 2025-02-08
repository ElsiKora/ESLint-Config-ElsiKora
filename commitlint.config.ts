import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
	extends: ["@commitlint/config-conventional"],
	parserPreset: "conventional-changelog-conventionalcommits",

	formatter: "@commitlint/format",

	rules: {
		"subject-case": [
			0,
			"always",
			[
				"lower-case", // lower case
				"upper-case", // UPPERCASE
				"camel-case", // camelCase
				"kebab-case", // kebab-case
				"pascal-case", // PascalCase
				"sentence-case", // Sentence case
				"snake-case", // snake_case
				"start-case", // Start Case
			],
		],

		"type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert", "wip"]],

		"scope-case": [2, "always", "lower-case"],
	},

	prompt: {
		settings: {
			enableMultipleScopes: true,
			scopeEnumSeparator: ",",
		},
		messages: {
			skip: ":skip",
			max: "upper %d chars",
			min: "%d chars at least",
			emptyWarning: "can not be empty",
			upperLimitWarning: "over limit",
			lowerLimitWarning: "below limit",
		},
		questions: {
			type: {
				description: "Select the type of change that you're committing:",
				enum: {
					wip: {
						description: "⌛️ Work in progress",
						title: "Progress",
						emoji: "⌛️",
					},
					feat: {
						description: "✨ A new feature",
						title: "Features",
						emoji: "✨",
					},
					fix: {
						description: "🐛 A bug fix",
						title: "Bug Fixes",
						emoji: "🐛",
					},
					docs: {
						description: "📚 Documentation only changes",
						title: "Documentation",
						emoji: "📚",
					},
					style: {
						description: "🎨 Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
						title: "Styles",
						emoji: "🎨",
					},
					refactor: {
						description: "📦 A code change that neither fixes a bug nor adds a feature",
						title: "Code Refactoring",
						emoji: "📦",
					},
					perf: {
						description: "🚀 A code change that improves performance",
						title: "Performance Improvements",
						emoji: "🚀",
					},
					test: {
						description: "🚨 Adding missing tests or correcting existing tests",
						title: "Tests",
						emoji: "🚨",
					},
					build: {
						description: "🛠 Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
						title: "Builds",
						emoji: "🛠",
					},
					ci: {
						description: "🤖 Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
						title: "Continuous Integrations",
						emoji: "🤖",
					},
					chore: {
						description: "🔩 Other changes that don't modify src or test files",
						title: "Chores",
						emoji: "🔩",
					},
					revert: {
						description: "🗑 Reverts a previous commit",
						title: "Reverts",
						emoji: "🗑",
					},
				},
			},
		},
	},
};

export default Configuration;
