#!/usr/bin/env node
import program from 'commander';
import { PKG_VERSION } from './config/constants';
import init from './actions/init';

const cwd = process.cwd();
// 注册版本号
program.version(PKG_VERSION);
// 注册指令
program
  .command('init')
  .description('一键接入：为项目初始化规范工具和配置，可以根据项目类型和需求进行定制')
  .option('-v --vscode', '初始化vscode配置')
  .action((cmd) => {
    init({
      cwd,
      checkVersionUpdate: true,
    });
  });

// 注入命令行参数
program.parse(program.argv);
