import path from 'path';
import type { ScanReport, ScanOptions, PKG, InitOptions, ScanResult, Config } from '../types';
import fs from 'fs-extra';
import { PKG_NAME } from '../config/constants';
import { doEslint } from '../lint/eslint';
import { doStylelint } from '../lint/stylelint';
import { doMarkdownlint } from '../lint/markdownlint';
import { doPrettier } from '../lint/prettier';
export default async (options: ScanOptions): Promise<ScanReport> => {
  const { cwd, outputReport, config, fix } = options;
  const pkg: PKG = fs.readJSONSync(path.resolve(cwd, 'package.json'));
  const configPath = path.resolve(cwd, `${PKG_NAME.replace(/@.*\//, '')}.config.js`);
  let scanConfig: Config =
    config ||
    (fs.existsSync(configPath) && require(path.resolve(cwd, `${PKG_NAME.replace(/@.*\//, '')}.config.js`))) ||
    {};
  let results: ScanResult[] = [];
  const runErrors: Error[] = [];
  if (fix && scanConfig.enablePrettier) {
    try {
      await doPrettier({ ...options, config: scanConfig });
    } catch (err) {
      runErrors.push(err);
    }
  }

  if (scanConfig.enableESLint) {
    try {
      const eslintResults: ScanResult[] = await doEslint({ ...options, pkg, config: scanConfig });
      results.push(...eslintResults);
    } catch (err) {
      runErrors.push(err);
    }
  }

  if (scanConfig.enableStylelint) {
    try {
      const stylelintResults: ScanResult[] = await doStylelint({ ...options, pkg, config: scanConfig });
      results.push(...stylelintResults);
    } catch (err) {
      runErrors.push(err);
    }
  }

  if (scanConfig.enableMarkdownlint) {
    try {
      const markdownResults: ScanResult[] = await doMarkdownlint({ ...options, pkg, config: scanConfig });
      results.push(...markdownResults);
    } catch (err) {
      runErrors.push(err);
    }
  }

  // 输出报告文件
  if (outputReport) {
    const reportPath = path.resolve(cwd, `./${PKG_NAME}-report.json`);
    fs.outputFile(reportPath, JSON.stringify(results, null, 2), () => {});
  }
  return {
    results,
    errorCount: results.reduce((acc, cur) => acc + cur.errorCount, 0),
    warningCount: results.reduce((acc, cur) => acc + cur.warningCount, 0),
    runErrors,
  };
};
