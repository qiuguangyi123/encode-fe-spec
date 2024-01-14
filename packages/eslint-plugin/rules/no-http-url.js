const name = 'no-http-url';
module.exports = {
  name,
  meta: {
    type: 'suggestion', // 这是一个报错问题的规则
    fixed: 'code', // 不要自动修复
    // 报错信息
    messages: {
      noHttpUrl: `The "{{url}}" is not recommended to use "http"`,
    },
  },
  create(context) {
    return {
      Literal(node) {
        const url = node?.value;
        if (!url) return;
        if (url.startsWith('http://')) {
          console.log(node);
          context.report({
            loc: node.loc,
            messageId: 'noHttpUrl',
            data: {
              url,
            },
            fix(fixer) {
              return fixer.replaceTextRange([node.range[0] + 1, node.range[0] + 5], 'https');
            },
          });
        }
      },
    };
  },
};
