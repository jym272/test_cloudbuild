const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/typescript",
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  plugins: ["prettier"],
  ignorePatterns: ["node_modules/", "build/"],
  rules: {
    // -- eslint-plugin-prettier recommended rules to avoid eslint/prettier conflicts
    "prettier/prettier": "warn",
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-loop-func": "off",
    // eslint-plugin-prettier recommended rules to avoid eslint/prettier conflicts --
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": {
          "arguments": false,
          "attributes": true
        }
      }
    ],
    // "@typescript-eslint/explicit-function-return-type": "off"
  },
};
