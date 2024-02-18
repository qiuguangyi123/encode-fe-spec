import path from 'path';
import type { ScanReport, ScanOptions, PKG, InitOptions } from '../types';
import fs from 'fs-extra';
export default async (options: ScanOptions): Promise<ScanReport> => {
  const { cwd, outputReport, config } = options;
  const pkg: PKG = fs.readJSONSync(path.resolve(cwd, 'package.json'));
  let scanConfig: Omit<InitOptions, 'cwd' | 'checkVersionUpdate' | 'disableNpmInstall' | 'rewriteConfig'>;
};
