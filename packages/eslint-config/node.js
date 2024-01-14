module.exports = {
  extends: ['./index.js', './rule/node.js'].map(require.resolve),
  root: true,
};
