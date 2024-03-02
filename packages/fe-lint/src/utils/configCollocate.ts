import glob from 'glob';
import { INQUIRER, InitOptions, PKG } from '../types';
import fs from 'fs-extra';
import path from 'path';
import log from '../utils/log';
import inquirer from 'inquirer';
import { ADD_PACKAGE_NAME, INQUIRER_VALUE, REMOVE_PACKAGE_NAME, REMOVE_PACKAGE_PREFIXES } from '../config/constants';
const checkUselessConfig: () => string[] = () => {
  return new Array<string>()
    .concat(glob.sync('.eslintrc?(.@(yaml|yml|json|js))'))
    .concat(glob.sync('.stylelintrc?(.@(yaml|yml|json|js))'))
    .concat(glob.sync('.markdownlint@(rc|?(.@(yaml|yml|json|js)))'))
    .concat(glob.sync('.prettierrc?(.@(js|cjs|config.js|config.cjs|yaml|yml|json|json5|toml))'))
    .concat(glob.sync('tslint.@(yaml|yml|json)'))
    .concat(glob.sync('.kelerc?(.@(yaml|yml|json))'))
    .concat(glob.sync('commitlint.config.@(yaml|yml|json|js)')) as string[];
};
export default async (options: Pick<InitOptions, 'cwd' | 'rewriteConfig'>) => {
  const isTest = process.env.NODE_ENV === 'test';
  const pkg: PKG = fs.readJSONSync(path.resolve(options.cwd, 'package.json'));
  // 要删除的配置文件
  const removeFiles = checkUselessConfig();
  // 找到要包含在要删除列表里的或者要删除前缀的包名
  const removePackageName = [
    ...Object.keys(pkg?.dependencies || {}),
    ...Object.keys(pkg?.devDependencies || {}),
  ].filter((item) => {
    return (
      REMOVE_PACKAGE_NAME.includes(item.toLowerCase()) ||
      REMOVE_PACKAGE_PREFIXES.some((prefixes) => item.toLowerCase().startsWith(prefixes))
    );
  });
  // 要重写的配置文件
  const resetFiles = glob
    .sync('template/*.ejs', {
      cwd: path.resolve(__dirname, '..'),
    })
    .map((file) =>
      path
        .basename(file)
        .replace(/\.ejs$/gi, '')
        .trim(),
    );
  if ([...removeFiles, ...removePackageName, ...resetFiles].length <= 0) return;
  // 看是否需要重写配置 如果不需要 进行提问 如果还不需要 直接退出进程
  if (!options.rewriteConfig) {
    options.rewriteConfig = (await inquirer.prompt(INQUIRER_VALUE[INQUIRER.REWRITE_CONFIG]))[INQUIRER.REWRITE_CONFIG];
    if (!options.rewriteConfig) process.exit(1);
  }
  if (removeFiles.length) {
    log.warn(`删除以下配置文件：${removeFiles.join(',')}`);
    for (const file of removeFiles) {
      fs.removeSync(path.resolve(options.cwd, file));
    }
  }
  if (removePackageName.length) {
    log.warn(`删除以下包：${removePackageName.join(',')}`);
    for (const packageName of removePackageName) {
      if (pkg?.dependencies) delete pkg?.dependencies[packageName];
      if (pkg?.devDependencies) delete pkg?.devDependencies[packageName];
    }
  }
  // 添加依赖
  if (Object.keys(ADD_PACKAGE_NAME).length) {
    for (const type of Object.keys(ADD_PACKAGE_NAME)) {
      if (!Object.keys(ADD_PACKAGE_NAME[type]).length) continue;
      if (!pkg[type]) pkg[type] = {};
      pkg[type] = Object.assign(pkg[type], ADD_PACKAGE_NAME[type]);
    }
  }
  if (resetFiles.length) {
    log.warn(`重写以下配置文件：${resetFiles.join(',')}`);
  }
  fs.writeJSONSync(path.resolve(options.cwd, 'package.json'), pkg, 'utf-8');
};
