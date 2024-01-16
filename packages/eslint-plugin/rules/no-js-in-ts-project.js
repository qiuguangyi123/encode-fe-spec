const path = require('path');
const RULE_NAME = 'no-js-in-ts-project';

const DEFAULT_WHITE_LIST = ['commitlint.config.js', 'eslintrc.js', 'prettierrc.js', 'stylelintrc.js'];
const JS_REG = /jsx?$/;

module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    fixable: null,
    messages: {
      noJSInTSProject: 'The "{{fileName}}" is not recommended in TS project',
    },
  },
  create(context) {
    const fileName = context.getFilename();
    const extName = path.extname(fileName);
    const ruleOptions = context.options[0] || {};
    let { whileList = [], merger = true } = ruleOptions;
    if (!whileList.length) {
      whileList = DEFAULT_WHITE_LIST;
    } else if (merger) {
      whileList = Array.from(new Set([...DEFAULT_WHITE_LIST, ...whileList]));
    }
    const whileListReg = new RegExp(`(${whileList.join('|')})$`);
    if (!whileListReg.test(fileName) && JS_REG.test(extName)) {
      // 这里只检测文件 没必要通过返回对象来拿文件里的节点
      // 由于是返回的文件节点 所以这里的loc是文件的位置
      context.report({
        loc: {
          start: {
            line: 0,
            column: 0,
          },
          end: {
            line: 0,
            column: 0,
          },
        },
        messageId: 'noJSInTSProject',
        data: {
          fileName,
        },
      });
    }
    return {};
  },
};
