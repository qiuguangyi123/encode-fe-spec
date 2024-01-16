const name = 'no-http-url';
module.exports = {
  name,
  meta: {
    type: 'suggestion', // 这是一个警告问题的规则
    fixable: 'code', // 自动修复
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
          context.report({
            loc: node.loc,
            messageId: 'noHttpUrl',
            data: {
              url,
            },
            // fix(fixer) {
            //   const fixedUrl = url.replace('http://', 'https://');
            //   // replaceText的参数必须是字符串 需要带有双引号
            //   return fixer.replaceText(node, `"${fixedUrl}"`);
            // },
          });
        }
      },
    };
  },
};
