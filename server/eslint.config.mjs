import js from "@eslint/js";
import ts from "typescript-eslint";

const eslintConfig = [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];

export default eslintConfig;
