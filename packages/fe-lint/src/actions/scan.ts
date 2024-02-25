import path from 'path';
import type { ScanReport, ScanOptions, PKG, InitOptions, ScanResult } from '../types';
import fs from 'fs-extra';
import { PKG_NAME } from '../config/constants';
import { doEslint } from '../lint/eslint';
export default async (options: ScanOptions): Promise<ScanReport> => {
  const { cwd, outputReport, config, fix } = options;
  const pkg: PKG = fs.readJSONSync(path.resolve(cwd, 'package.json'));
  let scanConfig: Omit<InitOptions, 'cwd' | 'checkVersionUpdate' | 'disableNpmInstall' | 'rewriteConfig'> =
    config || require(path.resolve(cwd, `${PKG_NAME.replace(/@.*\//, '')}.config.js`));
  let results: ScanResult[] = [];
  if (scanConfig.enableESLint) {
    const eslintResults: ScanResult[] = await doEslint({ ...options, pkg, config: scanConfig });
    console.log(eslintResults);
    results.push(...eslintResults);
  }
  return {
    results,
    errorCount: results.reduce((acc, cur) => acc + cur.errorCount, 0),
    warningCount: results.reduce((acc, cur) => acc + cur.warningCount, 0),
    runErrors: [],
  };
};
