const rules = require('../rules/no-broad-semantic-versioning');
const { RuleTester } = require('eslint');
// 创建测试实例
const ruleTester = new RuleTester();
// 测试用例
ruleTester.run('no-broad-semantic-versioning', rules, {
  // 正确的
  valid: [
    {
      filename: 'package.json',
      code: `module.exports = ${JSON.stringify({
        devDependencies: { 'eslint-plugin-encode': '^0.0.5' },
      })}`,
    },
    {
      filename: 'package.js',
      code: `var a = 1`,
    },
  ],
  // 错误的
  invalid: [
    {
      filename: 'package.json',
      code: `module.exports = ${JSON.stringify({
        devDependencies: { 'eslint-plugin-encode': '^0.0.x' },
      })}`,
      errors: [
        {
          messageId: 'noBroadSemanticVersioning',
          data: {
            dependencyName: 'eslint-plugin-encode',
            versioning: '^0.0.x',
          },
        },
      ],
    },
  ],
});
