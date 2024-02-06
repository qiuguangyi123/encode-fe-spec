import glob from 'glob';
import { PKG } from '../types';
import fs from 'fs-extra';
import path from 'path';
import { REMOVE_PACKAGE_NAME, REMOVE_PACKAGE_PREFIXES } from '../config/constants';
const checkUselessConfig = () => {
  return []
    .concat(glob.sync('.eslintrc?(.@(yaml|yml|json|js)'))
    .concat(glob.sync('.stylelintrc?(.@(yaml|yml|json|js)'))
    .concat(glob.sync('.markdownlint@(rc|?(.@(yaml|yml|json|js'))
    .concat(glob.sync('.prettier@(rc|?(.@(yaml|yml|json|js'))
    .concat(glob.sync('tslint.@(yaml|yml|json)'))
    .concat(glob.sync('.kelerc?(.@(yaml|yml|json)'));
};
export default ({ cwd }: Record<string, any>) => {
  const removeFiles = checkUselessConfig();
  const pkg: PKG = fs.readJSONSync(path.resolve(cwd, 'package.json'));
  // 找到要包含在要删除列表里的或者要删除前缀的包名
  const removePackageName = [
    ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ].filter((item) => {
    return (
      REMOVE_PACKAGE_NAME.includes(item.toLowerCase()) ||
      REMOVE_PACKAGE_PREFIXES.some((prefixes) => item.toLowerCase().startsWith(prefixes))
    );
  });
};
