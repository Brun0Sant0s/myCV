import { defineConfig } from "@playwright/test";

// `npm test`: builds the site, serves it like GitHub Pages (under /myCV/) and runs tests/ in the installed Chrome.
// It also runs before every `npm run deploy`.
export default defineConfig({
    testDir: "tests",
    timeout: 60_000,
    fullyParallel: true,
    reporter: "list",
    outputDir: "tests-results",
    use: {
        baseURL: "http://localhost:4173/myCV/",
        channel: "chrome",
        locale: "en-US",
    },
    webServer: {
        command: "npm run build && npx vite preview --port 4173 --strictPort",
        url: "http://localhost:4173/myCV/",
        reuseExistingServer: true,
        timeout: 120_000,
    },
});
