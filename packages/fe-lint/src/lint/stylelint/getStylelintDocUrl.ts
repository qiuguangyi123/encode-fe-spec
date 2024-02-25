/**
 * 获取 Stylelint 规则文档地址
 */
export function getStylelintRuleDocUrl(rule: string): string {
  // stylelint-scss
  const matchScss = rule.match(/^@scss\/(\S+)$/);
  if (matchScss) {
    return `https://github.com/kristerkari/stylelint-scss/tree/master/src/rules/${matchScss[1]}`;
  }
  // stylelint-less
  const matchLess = rule.match(/^@less\/(\S+)$/);
  if (matchLess) {
    return `https://github.com/stylelint-less/stylelint-less/tree/main/packages/stylelint-less/src/rules/${matchScss[1]}`;
  }
  if (rule !== 'CssSyntaxError') return `https://stylelint.io/user-guide/rules/list/${rule}`;

  return '';
}
