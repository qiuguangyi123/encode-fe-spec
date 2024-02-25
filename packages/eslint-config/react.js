module.exports = {
  extends: ['./index.js', './rules/react.js'].map(require.resolve),
  parserOptions: {
    parser: '@babel/eslint-parser',
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
};
