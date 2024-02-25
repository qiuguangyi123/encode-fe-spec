import { PKG, ScanOptions, InitOptions, Config } from '../../types';
import { ESLINT_FILE_EXT } from '../../config/constants';
import { ESLint } from 'eslint';
import glob from 'glob';
import getExtendConfig from './getExtendConfig';
import path from 'path';

interface DoEslintOptions extends ScanOptions {
  pkg: PKG;
  config: Omit<InitOptions, 'cwd' | 'checkVersionUpdate' | 'disableNpmInstall' | 'rewriteConfig'>;
}
export default (opts: DoEslintOptions, pkg: PKG, config: Config) => {
  let lintConfig: ESLint.Options = {
    cwd: opts.cwd,
    fix: opts.fix,
    ignore: opts.ignore,
    extensions: ESLINT_FILE_EXT, // 要扫描的文件类型
    errorOnUnmatchedPattern: false, // 未匹配到文件时不报错
  };
  // 如果用户传入了 eslintOptions，则用用户的
  if (config.eslintOptions) {
    lintConfig = Object.assign(lintConfig, config.eslintOptions);
  } else {
    // 看看目录下是否有eslintrc文件，若无则使用默认的 lint 配置
    const lintConfigFiles = glob.sync('.eslintrc?(.@(js|yaml|yml|json))', { cwd: opts.cwd });
    if (lintConfigFiles.length <= 0 && !pkg.eslintConfig) {
      // lintConfig.resolvePluginsRelativeTo = '../../'; // 用于解析插件的路径
      lintConfig.useEslintrc = false; // 是否向上找寻eslintrc文件
      lintConfig.baseConfig = {
        extends: [getExtendConfig(pkg, opts.cwd), config.enablePrettier ? 'prettier' : ''],
      };
    }
  }
  const ignoreFiles = glob.sync('.eslintignore', { cwd: opts.cwd });
  if (ignoreFiles.length <= 0) {
    lintConfig.ignorePath = path.resolve(__dirname, '../../template/_eslintignore.ejs');
  }
  return lintConfig;
};
