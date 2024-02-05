import path from 'path';
import { INQUIRER, PKG } from '../types';
import fs from 'fs';

// 导出脚手架基本信息
export const PKG_VALUE: PKG = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'));

export const PKG_VERSION = PKG_VALUE.version;

export const PKG_NAME = PKG_VALUE.name;

export const PROJECT_TYPE: Array<Record<string, string>> = [
  {
    name: '未使用 React、Vue、Node.js 的项目（JavaScript）',
    value: 'index',
  },
  {
    name: '未使用 React、Vue、Node.js 的项目（TypeScript）',
    value: 'typescript',
  },
  {
    name: 'React 项目（JavaScript）',
    value: 'react',
  },
  {
    name: 'React 项目（TypeScript）',
    value: 'typescript/react',
  },
  {
    name: 'Rax 项目（JavaScript）',
    value: 'rax',
  },
  {
    name: 'Rax 项目（TypeScript）',
    value: 'typescript/rax',
  },
  {
    name: 'Vue 项目（JavaScript）',
    value: 'vue',
  },
  {
    name: 'Vue 项目（TypeScript）',
    value: 'typescript/vue',
  },
  {
    name: 'Node.js 项目（JavaScript）',
    value: 'node',
  },
  {
    name: 'Node.js 项目（TypeScript）',
    value: 'typescript/node',
  },
  {
    name: '使用 ES5 及之前版本 JavaScript 的老项目',
    value: 'es5',
  },
];
export const INQUIRER_VALUE: Record<INQUIRER, any> = {
  [INQUIRER.VERSION]: {
    type: 'confirm',
    name: INQUIRER.VERSION,
    message: '检测到新的版本，是否需要自动升级 qgy-fe-lint 的版本？',
    default: () => {
      return true;
    },
  },
  [INQUIRER.ESLINT_TYPE]: {
    type: 'list',
    name: INQUIRER.ESLINT_TYPE,
    message: '请选择 eslint 类型',
    choices: PROJECT_TYPE,
  },
  [INQUIRER.ENABLE_STYLELINT]: {
    type: 'confirm',
    name: INQUIRER.ENABLE_STYLELINT,
    message: '是否启用 stylelint?',
    default: () => {
      return true;
    },
  },
};
