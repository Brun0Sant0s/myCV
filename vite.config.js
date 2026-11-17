import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// A short fingerprint of both CVs, added to their download links (?v=…),
// so browsers fetch the new PDF as soon as it changes instead of showing a cached one.
const cvVersion = createHash("md5")
    .update(readFileSync("public/documents/CV_BRUNO_EN.pdf"))
    .update(readFileSync("public/documents/CV_BRUNO_PT.pdf"))
    .digest("hex")
    .slice(0, 8);

// The site lives at brun0sant0s.github.io/myCV/, so every asset is served from /myCV/.
// The build goes to build/, which is what `npm run deploy` publishes to GitHub Pages.
export default defineConfig({
    base: "/myCV/",
    plugins: [react()],
    server: { port: 3000 },
    build: { outDir: "build" },
    define: { "import.meta.env.VITE_CV_VERSION": JSON.stringify(cvVersion) },
});
