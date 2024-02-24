import glob from 'glob';
import { PKG } from '../../types';
import { PKG_NAME } from '../../config/constants';
// 根据当前依赖和文件获取 ESLint 配置类型
export default (pkg: PKG, cwd: string) => {
  let dsl = '';
  const tsFiles = glob.sync('./!(node_modules)/**/*.@(ts|tsx)', { cwd: process.cwd() });
  const reactFiles = glob.sync('./!(node_modules)/**/*.@(jsx|tsx)', { cwd });
  const vueFiles = glob.sync('./!(node_modules)/**/*.vue', { cwd });
  const tsType = tsFiles.length > 0 ? 'typescript' : '';
  const keys = Object.keys(pkg.devDependencies);
  if (reactFiles.length || keys.some((name) => /^react(-|$)/gi.test(name))) {
    dsl = 'react';
  }
  if (vueFiles.length || keys.some((name) => /^vue(-|$)/gi.test(name))) {
    dsl = 'vue';
  }

  return `${PKG_NAME}/${tsType}/${dsl}`.replace(/\/$/, '/index').replace(/^\//, '');
};
