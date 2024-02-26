import path from 'path';
import type { ScanReport, ScanOptions, PKG, InitOptions, ScanResult } from '../types';
import fs from 'fs-extra';
import { PKG_NAME } from '../config/constants';
import { doEslint } from '../lint/eslint';
import { doStylelint } from '../lint/stylelint';
import { doMarkdownlint } from '../lint/markdownlint';
export default async (options: ScanOptions): Promise<ScanReport> => {
  const { cwd, outputReport, config, fix } = options;
  const pkg: PKG = fs.readJSONSync(path.resolve(cwd, 'package.json'));
  let scanConfig: Omit<InitOptions, 'cwd' | 'checkVersionUpdate' | 'disableNpmInstall' | 'rewriteConfig'> =
    config || require(path.resolve(cwd, `${PKG_NAME.replace(/@.*\//, '')}.config.js`));
  let results: ScanResult[] = [];
  const runErrors: Error[] = [];
  if (scanConfig.enableESLint) {
    try {
      const eslintResults: ScanResult[] = await doEslint({ ...options, pkg, config: scanConfig });
      console.log(eslintResults);
      results.push(...eslintResults);
    } catch (err) {
      runErrors.push(err);
    }
  }
  if (scanConfig.enableStylelint) {
    try {
      const stylelintResults: ScanResult[] = await doStylelint({ ...options, pkg, config: scanConfig });
      console.log(stylelintResults);
      results.push(...stylelintResults);
    } catch (err) {
      runErrors.push(err);
    }
  }
  if (scanConfig.enableMarkdownlint) {
    try {
      const markdownResults: ScanResult[] = await doMarkdownlint({ ...options, pkg, config: scanConfig });
      console.log(markdownResults);
      results.push(...markdownResults);
    } catch (err) {
      runErrors.push(err);
    }
  }
  // 输出报告文件
  if (outputReport) {
    const reportPath = path.resolve(process.cwd(), `./${PKG_NAME}-report.json`);
    fs.outputFile(reportPath, JSON.stringify(results, null, 2), () => {});
  }
  return {
    results,
    errorCount: results.reduce((acc, cur) => acc + cur.errorCount, 0),
    warningCount: results.reduce((acc, cur) => acc + cur.warningCount, 0),
    runErrors,
  };
};
