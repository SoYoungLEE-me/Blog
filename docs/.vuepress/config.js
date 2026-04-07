const path = require("path");

module.exports = {
  base: "/Blog/",
  title: "Soyoung's TIL",
  head: headConfig(),
  themeConfig: {
    smoothScroll: true,
    logo: "/images/logo.png",
    nav: navConfigs(),
    sidebarDepth: 2,

    sidebar: require("./sidebarConfig.js"),
  },

  postcss: {
    plugins: [require("tailwindcss"), require("autoprefixer")],
  },
};

function navConfigs() {
  return [{ text: "GitHub", link: "https://github.com/SoYoungLEE-me" }];
}

function headConfig() {
  return [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      { name: "viewport", content: "width=device-width,initial-scale=1" },
    ],
  ];
}
