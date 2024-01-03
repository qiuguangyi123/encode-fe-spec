module.exports = {
  extends: ["./index.js", "./rule/vue.js"].map(require.resolve),
  // 配置eslint解析器
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  root: true,
}
