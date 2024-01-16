const rule = require('../rules/no-http-url');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-http-url', rule, {
  valid: [
    {
      filename: 'test.js',
      code: 'var a = "https://qiuguangyi.com"',
    },
  ],
  invalid: [
    {
      filename: 'test.js',
      code: 'var a = "http://aaaa.com"',
      // output: 'var a = "https://aaaa.com"',
      errors: [
        {
          messageId: 'noHttpUrl',
          data: {
            url: 'http://aaaa.com',
          },
        },
      ],
    },
  ],
});
