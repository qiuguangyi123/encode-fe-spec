import path from 'path';
import { STYLELINT_FILE_EXT, STYLELINT_IGNORE_PATTERN } from '../../config/constants';
import { InitOptions, PKG, ScanOptions } from '../../types';
import glob from 'glob';
import stylelint from 'stylelint';
import getStylelintConfig from './getStylelintConfig';
import formatStylelintResults from './formatStylelintResults';

interface DoStylelintOptions extends ScanOptions {
  pkg: PKG;
  config: Omit<InitOptions, 'cwd' | 'checkVersionUpdate' | 'disableNpmInstall' | 'rewriteConfig'>;
}
export default async (options: DoStylelintOptions) => {
  if (options.config.enableStylelint === false) return [];
  // 要扫描的文件数组
  let files: string[] = [];
  if (options.files) {
    files = options.files.filter((filter) => {
      return STYLELINT_FILE_EXT.includes(path.extname(path.basename(filter)));
    });
  }

  files = files.concat(
    glob
      .sync(`**/*.@(${STYLELINT_FILE_EXT.map((name) => name.replace(/\./gi, '')).join('|')})`, {
        cwd: path.resolve(options.cwd, options.include),
        ignore: STYLELINT_IGNORE_PATTERN,
      })
      .map((file) => path.resolve(options.cwd, options.include, file)),
  );
  const data = await stylelint.lint({
    // 处理配置
    ...getStylelintConfig(options, options.pkg, options.config),
    files,
  });

  return formatStylelintResults(data.results, options.quiet);
};
