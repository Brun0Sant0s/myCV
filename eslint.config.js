import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

// `npm run lint`: catches unused code, hook mistakes and common bugs before a deploy.
export default [
    { ignores: ["build", "node_modules", "tests-results", "playwright-report"] },
    js.configs.recommended,
    {
        files: ["src/**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globals.browser,
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
        settings: { react: { version: "detect" } },
        plugins: { react, "react-hooks": reactHooks, "react-refresh": reactRefresh },
        rules: {
            ...react.configs.recommended.rules,
            ...react.configs["jsx-runtime"].rules,
            ...reactHooks.configs.recommended.rules,
            "react/prop-types": "off",
            "react/no-unescaped-entities": "off",
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        },
    },
    {
        files: ["*.config.js"],
        languageOptions: { globals: globals.node, sourceType: "module" },
    },
    // Tests run in Node, but the callbacks passed to page.evaluate run in the browser
    {
        files: ["tests/**/*.js"],
        languageOptions: { globals: { ...globals.node, ...globals.browser }, sourceType: "module" },
    },
];
