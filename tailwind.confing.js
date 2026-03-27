module.exports = {
  content: [
    "./docs/.vuepress/theme/**/*.vue",
    "./docs/.vuepress/components/**/*.vue",
    "./docs/**/*.md",
  ],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
