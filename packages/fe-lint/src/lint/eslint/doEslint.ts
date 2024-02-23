import path from 'path';
import { InitOptions, PKG, ScanOptions, ScanResult } from '../../types';
import { ESLINT_FILE_EXT } from '../../config/constants';
import glob from 'glob';

interface DoEslintOptions extends ScanOptions {
  pkg: PKG;
  options: Omit<InitOptions, 'cwd' | 'checkVersionUpdate' | 'disableNpmInstall' | 'rewriteConfig'>;
}
export default (options: DoEslintOptions): ScanResult[] => {
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
        cwd: options.cwd,
      })
      .map((file) => path.resolve(options.cwd, file)),
  );
};
