import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import unusedImports from "eslint-plugin-unused-imports";
import airbnbBase from "eslint-config-airbnb-base";
import airbnbBaseTypescript from "eslint-config-airbnb-base-typescript";

export default defineConfig([
  js.configs.recommended,
  { 
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { 
      parser: tsParser,
      globals: {
        ...globals.node,
        ...globals.browser,
      },
     }, 
    plugins: { 
      "@typescript-eslint":tseslint,
      "unused-imports": unusedImports,
    },
    rules: {
     ...airbnbBase.rules,
     ...airbnbBaseTypescript.rules,
     "no-unused-vars": "off",
     "unused-imports/no-unused-vars":[
      "wars",
      {
        vars: "all",
        args: "after-used",
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      }
     ],
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js","jsx",".ts",".tsx"],
        },
      },
    },
  }
]);