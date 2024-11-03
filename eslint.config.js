import createConfig from '@elsikora/eslint-config';

export default [
  {
    ignores: [
  "**/node_modules/",
  "**/.git/",
  "**/dist/",
  "**/build/",
  "**/coverage/",
  "**/.vscode/",
  "**/.idea/",
  "**/*.min.js",
  "**/*.bundle.js"
]
  },
  ...createConfig({
    javascript: true,
    typescript: true,
    prettier: true,
    react: true,
    json: true,
  })
];
