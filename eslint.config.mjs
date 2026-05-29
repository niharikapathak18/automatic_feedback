import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"

export default [
  {
    ignores: ["**/node_modules/**", ".next/**", "public/**", "eslint.config.js"],
  },
  {
    files: ["app/**/*.{js,jsx,ts,tsx}", "components/**/*.{js,jsx,ts,tsx}", "hooks/**/*.{js,jsx,ts,tsx}", "lib/**/*.{js,jsx,ts,tsx}", "app/**/*.{d.ts}", "next-env.d.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
      globals: {
        JSX: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
]
