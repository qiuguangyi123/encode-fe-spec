import { Config, PKG, ScanOptions } from '../../types';
import stylelint from 'stylelint';
import glob from 'glob';
import path from 'path';
import fs from 'fs';

export default (opts: ScanOptions, pkg: PKG, config: Config) => {
  const { cwd, fix } = opts;
  if (config.enableStylelint === false) return {} as any;

  const lintConfig: stylelint.LinterOptions = {
    fix: Boolean(fix),
    allowEmptyInput: true,
    ignoreDisables: !opts.ignore,
  };

  if (config.stylelintOptions) {
    // 若用户传入了 stylelintOptions，则用用户的
    Object.assign(lintConfig, config.stylelintOptions);
  } else {
    // 根据扫描目录下有无lintrc文件，若无则使用默认的 lint 配置
    const lintConfigFiles = glob.sync('.stylelintrc?(.@(js|yaml|yml|json))', { cwd });
    if (lintConfigFiles.length === 0 && !pkg.stylelint) {
      lintConfig.config = {
        extends: 'stylelint-config-qgy',
      };
    }
    // 根据扫描目录下有无lintignore文件，若无则使用默认的 ignore 配置
    const ignoreFilePath = path.resolve(cwd, '.stylelintignore');

    if (!fs.existsSync(ignoreFilePath)) {
      lintConfig.ignorePath = path.resolve(__dirname, '../../template/_stylelintignore.ejs');
    }
  }

  return lintConfig;
};
