module.exports = {
  extends: ['./index.js'].map(require.resolve),
  // plugins: ['qgy'],
  // rules: {
  //   'qgy/no-broad-semantic-versioning': 'error',
  // },
  root: true,
};
