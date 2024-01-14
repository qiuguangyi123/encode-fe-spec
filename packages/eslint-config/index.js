module.exports = {
  extends: [
    './rules/base/best-practices',
    './rules/base/possible-errors',
    './rules/base/style',
    './rules/base/variables',
    './rules/base/es6',
    './rules/base/strict',
    './rules/imports',
    './rules/json',
  ]
    .map(require.resolve)
    .concat(['plugin:qgy/recommended']),
  parser: '@babel/eslint-parser',
  // 告诉编译器要如何运行
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: true,
      jsx: true,
    },
  },
  // 告诉eslint找当前配置文件不能往父级查找
  root: true,
};
