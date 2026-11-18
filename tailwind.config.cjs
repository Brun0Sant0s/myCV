module.exports = {
  // :hover styles only on devices that can really hover, so a tap never leaves a button stuck in its hover look
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat:["Montserrat", "sans-serif"],
        syncopate:["Syncopate", "sans-serif"],
        mono:["JetBrains Mono", "Consolas", "monospace"]
      },
    },
  },
  plugins: [],
};
