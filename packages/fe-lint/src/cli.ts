#!/usr/bin/env node
import program from 'commander';
import { PKG_NAME, PKG_VERSION } from './config/constants';
import init from './actions/init';
import renderTemplate from './utils/renderTemplate';
import path from 'path';
import fs from 'fs';
import { InitOptions } from './types';

const cwd = process.cwd();
// 注册版本号
program.version(PKG_VERSION);
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

// 注入命令行参数
program.parse(program.argv);
