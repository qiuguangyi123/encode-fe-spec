const path = require('path');
const RULE_NAME = 'no-broad-semantic-versioning';

module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'problem',
    fixed: false,
    messages: {
      noBroadSemanticVersioning: `The "{{dependencyName}}" is not recommended to use "{{versioning}}"`,
    },
  },
  create(context) {
    // console.log(path.basename('./././test.js'));
    if (path.basename(context.getFilename()) !== 'package.json') {
      return {};
    }
    const rule = /(workspace:\*)|(\^\d+\.\d+\.\d+)/gi;
    // const cwd = context.getCwd();
    return {
      Property(node) {
        // console.log(node);
        try {
          if (['dependencies', 'devDependencies'].includes(node?.key.value)) {
            node.value.properties.forEach((val) => {
              const properties = val.value.value;
              if (properties.indexOf('x') > -1 || properties.indexOf('>') > -1 || (properties.indexOf('*') > -1 && properties !== 'workspace:*')) {
                // properties.indexOf('x') > -1 || properties.indexOf('>') > -1 || (properties.indexOf('*') > -1 && properties !== 'workspace:*')
                // console.log(rule.test(val?.value?.value), val?.value?.value);
                // 进行报错
                context.report({
                  loc: val.loc, // 报错行数
                  messageId: 'noBroadSemanticVersioning', // 报错信息
                  data: {
                    dependencyName: val?.key?.value ?? '丢失',
                    versioning: val?.value?.value ?? '丢失',
                  },
                });
              }
            });
          }
        } catch (e) {
          console.log(e);
        }
      },
    };
    // return {
    //   Property: function handleRequires(node) {
    //     if (node.key && node.key.value && (node.key.value === 'dependencies' || node.key.value === 'devDependencies') && node.value && node.value.properties) {
    //       node.value.properties.forEach((property) => {
    //         if (property.key && property.key.value) {
    //           const dependencyName = property.key.value;
    //           const dependencyVersion = property.value.value;
    //           if (
    //             // *
    //             dependencyVersion.indexOf('*') > -1 ||
    //             // x.x
    //             dependencyVersion.indexOf('x') > -1 ||
    //             // > x
    //             dependencyVersion.indexOf('>') > -1
    //           ) {
    //             context.report({
    //               loc: property.loc,
    //               messageId: 'noBroadSemanticVersioning',
    //               data: {
    //                 dependencyName,
    //                 versioning: dependencyVersion,
    //               },
    //             });
    //           }
    //         }
    //       });
    //     }
    //   },
    // };
  },
};
