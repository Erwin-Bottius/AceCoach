// eslint.config.js
import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default [
  { ignores: ["src/test/**", "**/node_modules/**", "dist/**"] },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: {
      globals: {
        // Globaux Node.js
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        // Globaux pour les tests (si nécessaire)
        describe: "readonly",
        require: "readonly",
        it: "readonly",
        expect: "readonly",
        jest: "readonly",
      },
    },
    plugins: {
      prettier,
    },

    rules: {
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: false,
          printWidth: 100,
          trailingComma: "all",
          tabWidth: 2,
          useTabs: false,
        },
      ],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Règles TypeScript
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "no-duplicate-imports": "error",
      "no-else-return": "error",
      "no-nested-ternary": "error",
      "no-return-await": "error",
      "prefer-const": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-shadow": "error",
      "no-undef": "error",
    },
  },
];
