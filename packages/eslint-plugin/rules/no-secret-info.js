const RULE_NAME = 'no-secret-info';
const DEFAULT_DANGEROUS_KEYS = ['secret', 'token', 'password'];
// 检测是否有敏感词规则
module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'problem',
    fixable: null,
    messages: {
      noSecretInfo: 'Detect that the "{{secret}}" might be a secret token, Please check!',
    },
  },
  create(context) {
    const options = context.options[0] || {};
    let { dangerousKeys = [], autoMerge = true } = options;
    if (dangerousKeys.length) {
      dangerousKeys = [...new Set([...DEFAULT_DANGEROUS_KEYS, ...dangerousKeys])];
    } else dangerousKeys = DEFAULT_DANGEROUS_KEYS;
    const reg = new RegExp(dangerousKeys.join('|'), 'g');
    return {
      Literal(node) {
        const parent = node?.parent ?? {};
        console.log(parent?.value);
        // 检测是否是变量声明出现或者对象属性出现
        if ((parent?.type === 'VariableDeclarator' && reg.test(parent?.id?.name)) || (parent?.type === 'Property' && reg.test(parent?.key?.name))) {
          context.report({
            node,
            messageId: 'noSecretInfo',
            data: {
              secret: node.value,
            },
          });
        }
      },
    };
  },
};
