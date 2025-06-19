import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      js,
      prettier,
    },
    rules: {
      // ✅ Style rules
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "comma-dangle": ["error", "always-multiline"],
      indent: ["error", 2],
      "object-curly-spacing": ["error", "always"],

      // ✅ TypeScript-specific
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/no-explicit-any": "warn",

      "prettier/prettier": "error",
    },
  },

  // ✅ Recommended rules
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
]);
