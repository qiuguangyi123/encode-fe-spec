module.exports = {
  defaultSeverity: "warning",
  plugins: ["stylelint-scss"],
  rules: {
    // null是不启用 true是启用 [true,{xxx}]启用并且进行配置
    // 对于未知字符是否进行检测
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
    // 禁止空块
    "block-no-empty": null,
  },
}
