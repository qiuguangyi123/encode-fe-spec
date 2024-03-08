module.exports = {
  extends: ['../vue.js', '../rules/typescript.js'].map(require.resolve),
  // parserOptions: {
  //   // https://github.com/mysticatea/vue-eslint-parser#parseroptionsparser
  //   parser: '@typescript-eslint/parser',
  // },
};
