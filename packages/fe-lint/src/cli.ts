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

const cwd = process.cwd();
// 注册版本号
program.version(PKG_VERSION);
// 若无 node_modules，则帮用户 install（否则会找不到 config）
const installDepsIfThereNo = () => {
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
    spawnSync(npmType(), ['install'], { stdio: 'inherit' });
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
  .description('扫描代码规范')
  .option('-q --quiet', '仅包含错误信息')
  .option('-o --output-report', '输出扫描出的规范问题日志')
  .option('-i --include <dirPath>', '指定要扫描的目录')
  .option('--no-ignore', '忽略eslint的ignore配置文件和ignore规则')
  .action(() => {
    try {
      installDepsIfThereNo();
    } catch (err) {
      console.log(err);
      log.error('扫描出错，请稍后再试！');
      process.exit(1);
    }
    installDepsIfThereNo();
  });

// 注入命令行参数
program.parse(program.argv);
