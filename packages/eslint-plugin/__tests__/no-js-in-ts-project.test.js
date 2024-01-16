const rule = require('../rules/no-js-in-ts-project');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-js-in-ts-project', rule, {
  valid: [
    {
      filename: 'home.ts',
      code: ' ',
    },
    {
      filename: 'stylelintrc.js',
      code: ' ',
    },
  ],
  invalid: [
    {
      filename: 'home.js',
      code: ' ',
      errors: [
        {
          messageId: 'noJSInTSProject',
          data: {
            fileName: 'home.js',
          },
        },
      ],
    },
  ],
});
