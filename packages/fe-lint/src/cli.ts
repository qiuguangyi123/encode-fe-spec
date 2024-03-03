#!/usr/bin/env node
import program from 'commander';
import { PKG_NAME, PKG_VERSION } from './config/constants';
import init from './actions/init';
import renderTemplate from './utils/renderTemplate';
import path from 'path';
import fs from 'fs';
import { InitOptions } from './types';
import log from './utils/log';
import glob from 'glob';
import { spawnSync } from 'child_process';
import npmType from './utils/npmType';
import scan from './actions/scan';
import ora from 'ora';
import printFormattedResults from './utils/printFormattedResults';
import { gitDiffNameOnly, gitDiffStaged } from './utils/git';
import updateVersion from './utils/updateVersion';

const cwd = process.cwd();
// 注册版本号
program.version(PKG_VERSION);
// 若无 node_modules，则帮用户 install（否则会找不到 config）
const installDepsIfThereNo = () => {
  try {
    const lintConfigFiles = []
      .concat(glob.sync('.eslintrc?(.@(yaml|yml|json|js))'))
      .concat(glob.sync('.stylelintrc?(.@(yaml|yml|json|js))'))
      .concat(glob.sync('.markdownlint@(rc|?(.@(yaml|yml|json|js)))'))
      .concat(glob.sync('.prettierrc?(.@(js|cjs|config.js|config.cjs|yaml|yml|json|json5|toml))'))
      .concat(glob.sync('tslint.@(yaml|yml|json)'))
      .concat(glob.sync('.kelerc?(.@(yaml|yml|json))'))
      .concat(glob.sync('commitlint.config.@(yaml|yml|json|js)')) as string[];
    const nodeModulesPath = path.resolve(cwd, 'node_modules');
    if (lintConfigFiles.length > 0 && !fs.existsSync(nodeModulesPath)) {
      log.info(`使用项目 Lint 配置，检测到项目未安装依赖，将进行安装（执行 ${npmType()} install）`);
      const { status } = spawnSync(npmType(), ['install'], { stdio: 'inherit' });
      if (status) throw new Error('自动更新出错，请手动更新');
    }
  } catch (err) {
    console.log(err);
    log.error('自动下载依赖失败！');
    process.exit(0);
  }
};
// 注册指令
program
  .command('init')
  .description('一键接入：为项目初始化规范工具和配置，可以根据项目类型和需求进行定制')
  .option('-v --vscode', '初始化vscode配置')
  .action((cmd) => {
    if (cmd.vscode) {
      try {
        const configPath = path.resolve(cwd, `${PKG_NAME.replace(/@.*\//, '')}.config.js`);
        const configContent: Omit<InitOptions, 'cwd' | 'checkVersionUpdate'> = require(configPath);
        renderTemplate(cwd, configContent, true);
      } catch (err) {
        console.log(err);
        process.exit(1);
      }
    } else {
      init({
        cwd,
        checkVersionUpdate: true,
      });
    }
  });
program
  .command('scan')
  .description('一键扫描：对项目进行代码规范问题扫描')
  .option('-q --quiet', '仅包含错误信息')
  .option('-o --output-report', '输出扫描出的规范问题日志')
  .option('-i --include <dirPath>', '指定要扫描的目录')
  .option('-f --fix', '自动修复')
  .option('--noIgnore', '忽略ignore配置文件和ignore规则')
  .action(async (options) => {
    const checking = ora();
    checking.start(`执行 ${PKG_NAME} 代码检查`);
    try {
      installDepsIfThereNo();
      const { runErrors, errorCount, warningCount, results } = await scan({
        cwd: options.cwd || process.cwd(),
        include: options.include || process.cwd(),
        quiet: options.quiet || false,
        ignore: !options.noIgnore ?? true,
        outputReport: options.outputReport || false,
        fix: options.fix ?? false,
      });
      let type = 'succeed';
      if (errorCount > 0) type = 'fail';
      else if (warningCount > 0) type = 'warn';
      checking[type]();
      if (results.length > 0) printFormattedResults(results, options.fix);
      if (runErrors.length > 0) runErrors.forEach((error) => log.error(error));
    } catch (err) {
      console.log(err);
      checking.fail();
      log.error('扫描出错，请稍后再试！');
      process.exit(1);
    }
  });

program
  .command('commit-msg-scan')
  .description('commit message 检查: git commit 时对 commit message 进行检查')
  .action(async () => {
    try {
      const { status } = spawnSync('commitlint', ['-E', 'HUSKY_GIT_PARAMS']);
      if (status !== 0) {
        log.error('commit message 格式不正确，请检查后重新提交');
        process.exit(1);
      }
    } catch (err) {
      log.error(err);
      process.exit(1);
    }
  });

program
  .command('commit-file-scan')
  .description('代码提交检查: git commit 时对提交代码进行规范问题扫描')
  .option('-s, --strict', '严格模式，对 warn 和 error 问题都卡口，默认仅对 error 问题卡口')
  .action(async (options) => {
    const files = await gitDiffNameOnly({});
    if (files && files.length > 0) {
      log.warn(`[${PKG_NAME}] changes not staged for commit: \n${files}\n`);
    }
    const cacheFiles = await gitDiffStaged({});
    const { errorCount, warningCount, results } = await scan({
      cwd: process.cwd(),
      include: process.cwd(),
      quiet: !options.strict,
      fix: false,
      outputReport: false,
      files: cacheFiles,
      ignore: true,
    });
    if (results.length > 0) printFormattedResults(results, false);
    if (errorCount || (options.strict && warningCount)) {
      log.error(`[${PKG_NAME}] 代码提交失败，请检查代码规范问题`);
      process.exit(1);
    }
  });

program
  .command('update')
  .description('更新规范工具')
  .action(() => {
    updateVersion();
  });
// 注入命令行参数
program.parse(program.argv);
