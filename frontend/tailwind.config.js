import { heroui } from "@heroui/theme";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/**/*.{js,ts,jsx,tsx}"
  ],
  theme: { extend: {} },
  darkMode: "class",
  plugins: [heroui()]
};
