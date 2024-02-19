import path from 'path';
import type { ScanReport, ScanOptions, PKG, InitOptions, ScanResult } from '../types';
import fs from 'fs-extra';
import { PKG_NAME } from '../config/constants';
export default async (options: ScanOptions): Promise<ScanReport> => {
  const { cwd, outputReport, config, fix } = options;
  const pkg: PKG = fs.readJSONSync(path.resolve(cwd, 'package.json'));
  let scanConfig: Omit<InitOptions, 'cwd' | 'checkVersionUpdate' | 'disableNpmInstall' | 'rewriteConfig'> =
    config || fs.readJSONSync(path.resolve(cwd, `${PKG_NAME.replace(/@.*\//, '')}.config.js`));
  let results: ScanResult[] = [];
  if (scanConfig.enableESLint) {
    const eslintResults: ScanResult[] = await doESlint({ ...options, pkg, config: scanConfig });
    results.push(...eslintResults);
  }
};
