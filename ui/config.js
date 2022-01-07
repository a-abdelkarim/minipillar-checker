var path = require("path");

var root = path.join(__dirname);

var config = {
  rootDir: root,
  // Targets ========================================================
  serveDir: path.join(root, ".serve"),
  distDir: path.join(root, "dist"),
  clientManifestFile: "manifest.webpack.json",
  clientStatsFile: "stats.webpack.json",
  publicPath: "/assets/",
  // Source Directory ===============================================
  srcDir: path.join(root, "app"),
  srcServerDir: path.join(root, "server"),

  // HTML Layout ====================================================
  srcHtmlLayout: path.join(root, "app", "index.html"),

  // Site Config ====================================================
  siteTitle: "React Webpack APP",
  siteDescription: "React Webpack APP init",
  siteCannonicalUrl: "http://localhost:3001",
  siteKeywords: "React Webpack APP init",
  scssIncludes: [],
};

module.exports = config;
