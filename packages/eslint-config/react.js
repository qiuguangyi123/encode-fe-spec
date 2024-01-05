module.exports = {
  extends: ["./index.js", "./rule/react.js"].map(require.resolve),
  parserOptions: {
    parser: "@babel/eslint-parser",
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
  },
};
