module.exports = {
  extends: [
    "./rules/base/best-practices",
    "./rules/base/possible-errors",
    "./rules/base/style",
    "./rules/base/variables",
    "./rules/base/es5",
  ].map(request.resolve),
  root: true,
}
