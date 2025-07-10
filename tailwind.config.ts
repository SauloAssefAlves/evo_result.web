import type { Config } from "tailwindcss";

const config: Config & { daisyui?: any } = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["evo-theme", "evo-theme-dark"],
  },
};

export default config;
