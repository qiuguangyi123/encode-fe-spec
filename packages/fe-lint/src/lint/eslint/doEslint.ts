import path from 'path';
import { InitOptions, PKG, ScanOptions, ScanResult } from '../../types';
import { ESLINT_FILE_EXT, ESLINT_IGNORE_PATTERN } from '../../config/constants';
import glob from 'glob';
import { ESLint } from 'eslint';
import getEslintConfig from './getEslintConfig';
import { formatESLintResults } from './formatESLintResults';
interface DoEslintOptions extends ScanOptions {
  pkg: PKG;
  config: Omit<InitOptions, 'cwd' | 'checkVersionUpdate' | 'disableNpmInstall' | 'rewriteConfig'>;
}
export default async (options: DoEslintOptions): Promise<ScanResult[]> => {
  // 要扫描的文件数组
  let files: string[] = [];
  if (options.files) {
    files = options.files.filter((filter) => {
      return ESLINT_FILE_EXT.includes(path.extname(path.basename(filter)));
    });
  }
  files = files.concat(
    glob
      .sync(`**/*.@(${ESLINT_FILE_EXT.map((name) => name.replace(/\./gi, '')).join('|')})`, {
        cwd: path.resolve(options.cwd, options.include),
        ignore: ESLINT_IGNORE_PATTERN,
      })
      .map((file) => path.resolve(options.cwd, options.include, file)),
  );
  const eslint = new ESLint(getEslintConfig(options, options.pkg, options.config));
  const reports = await eslint.lintFiles(files);
  if (options.fix) {
    ESLint.outputFixes(reports);
  }
  return formatESLintResults(reports, options.quiet, eslint);
};
