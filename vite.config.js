import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The site lives at brun0sant0s.github.io/myCV/, so every asset is served from /myCV/.
// The build goes to build/, which is what `npm run deploy` publishes to GitHub Pages.
export default defineConfig({
    base: "/myCV/",
    plugins: [react()],
    server: { port: 3000 },
    build: { outDir: "build" },
});
