module.exports = {
  extends: ['./index.js', './rules/node.js'].map(require.resolve),
  root: true,
};
