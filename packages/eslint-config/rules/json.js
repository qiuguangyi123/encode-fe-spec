module.exports = {
  plugins: ['json'],
  overrides: [
    {
      files: ['*.json'],
      rules: {
        'json/*': [
          'error',
          {
            allowComments: true,
            allowTrailingCommas: true,
            allowTemplateLiterals: true,
          },
        ],
      },
    },
  ],
};
