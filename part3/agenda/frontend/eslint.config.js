import globals from "globals";
import pluginReact from "eslint-plugin-react";
import react from "eslint-plugin-react";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ['dist', 'node_modules']
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { 
      js,
      react: pluginReact, 
      "@stylistic": stylistic 
    },
    settings: {
      react: {version: 'detect'},
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unused-vars": "warn",
      "eqeqeq": "error"
    },
    extends: ["js/recommended"],
  },
  pluginReact.configs.flat.recommended,
]);


