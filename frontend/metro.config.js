const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.platforms = ["ios", "android", "native", "web"];

// Enable importing .svg files as React components via react-native-svg-transformer
defaultConfig.transformer = defaultConfig.transformer || {};
defaultConfig.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

defaultConfig.resolver = defaultConfig.resolver || {};
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
defaultConfig.resolver.sourceExts = [
  ...(defaultConfig.resolver.sourceExts || []),
  "svg",
];

module.exports = defaultConfig;
