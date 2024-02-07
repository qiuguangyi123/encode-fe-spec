import path from 'path';
import { INQUIRER, PKG } from '../types';
import fs from 'fs';

export const UNICODE = {
  success: '\u2714',
  failure: '\u2716',
};

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
  [INQUIRER.ENABLE_MARKDOWNLINT]: {
    type: 'confirm',
    name: INQUIRER.ENABLE_MARKDOWNLINT,
    message: '是否启用 markdownlint?',
    default: () => {
      return true;
    },
  },
  [INQUIRER.ENABLE_PRETTIER]: {
    type: 'confirm',
    name: INQUIRER.ENABLE_PRETTIER,
    message: '是否启用 prettier?',
    default: () => {
      return true;
    },
  },
  [INQUIRER.ENABLE_COMMITLINT]: {
    type: 'confirm',
    name: INQUIRER.ENABLE_COMMITLINT,
    message: '是否启用 commitlint?',
    default: () => {
      return true;
    },
  },
  [INQUIRER.REWRITE_CONFIG]: {
    type: 'confirm',
    name: INQUIRER.REWRITE_CONFIG,
    message: '检测到配置冲突，是否需要自动重写 lint 配置?',
    default: () => {
      return true;
    },
  },
};

export const REMOVE_PACKAGE_NAME: string[] = [
  '@babel/eslint-parser',
  '@commitlint/cli',
  '@iceworks/spec',
  'babel-eslint',
  'eslint',
  'husky',
  'markdownlint',
  'prettier',
  'stylelint',
  'tslint',
];

export const REMOVE_PACKAGE_PREFIXES: string[] = [
  '@commitlint/',
  '@typescript-eslint/',
  'eslint-',
  'stylelint-',
  'markdownlint-',
  'commitlint-',
];

/**
 * eslint 扫描文件扩展名
 */
export const ESLINT_FILE_EXT: string[] = ['.js', '.jsx', '.ts', '.tsx', '.vue'];

/**
 * eslint 扫描忽略的文件或文件目录
 * 需要同步到 config/.eslintignore.ejs
 */
export const ESLINT_IGNORE_PATTERN: string[] = [
  'node_modules',
  'build',
  'dist',
  'coverage',
  'es',
  'lib',
  '**/*.min.js',
  '**/*-min.js',
  '**/*.bundle.js',
];

/**
 * stylelint 扫描文件扩展名
 */
export const STYLELINT_FILE_EXT: string[] = ['.css', '.scss', '.less', '.acss'];

/**
 * stylelint 扫描忽略的文件或文件目录
 */
export const STYLELINT_IGNORE_PATTERN: string[] = [
  'node_modules/',
  'build/',
  'dist/',
  'coverage/',
  'es/',
  'lib/',
  '**/*.min.css',
  '**/*-min.css',
  '**/*.bundle.css',
];

/**
 * markdownLint 扫描文件扩展名
 */
export const MARKDOWN_LINT_FILE_EXT: string[] = ['.md'];

/**
 * markdownLint 扫描忽略的文件或文件目录
 */
export const MARKDOWN_LINT_IGNORE_PATTERN: string[] = ['node_modules/', 'build/', 'dist/', 'coverage/', 'es/', 'lib/'];

/**
 * Prettier 扫描文件扩展名
 */
export const PRETTIER_FILE_EXT = [...STYLELINT_FILE_EXT, ...ESLINT_FILE_EXT, ...MARKDOWN_LINT_FILE_EXT];

/**
 * Prettier 扫描忽略的文件或文件目录
 */
export const PRETTIER_IGNORE_PATTERN: string[] = [
  'node_modules/**/*',
  'build/**/*',
  'dist/**/*',
  'lib/**/*',
  'es/**/*',
  'coverage/**/*',
];
