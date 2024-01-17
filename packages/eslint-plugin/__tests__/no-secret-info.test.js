const rule = require('../rules/no-secret-info');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-secret-info', rule, {
  valid: [
    {
      filename: 'test.js',
      code: 'var a = "https://qiuguangyi.com"',
    },
  ],
  invalid: [
    {
      filename: 'test.js',
      code: 'var token = "http://aaaa.com"',
      errors: [
        {
          messageId: 'noSecretInfo',
          data: {
            secret: 'http://aaaa.com',
          },
        },
      ],
    },
    {
      filename: 'test.js',
      code: 'var a = {password:123456}',
      errors: [
        {
          messageId: 'noSecretInfo',
          data: {
            secret: '123456',
          },
        },
      ],
    },
  ],
});
