import { INQUIRER_VALUE } from '../config/constants';
import { INQUIRER, InitOptions } from '../types';
import updateVersion from '../utils/updateVersion';
import inquirer from 'inquirer';

export default async (options: InitOptions) => {
  const isTest = process.env.NODE_ENV === 'test';
  const config: Omit<InitOptions, 'cwd' | 'checkVersionUpdate'> = {};
  if (options.checkVersionUpdate && !isTest) {
    updateVersion();
  }
  // 构建各个配置是否需要数据
  config.enableESLint = options.enableESLint || true;
  config.eslintType = (await inquirer.prompt(INQUIRER_VALUE[INQUIRER.ESLINT_TYPE]))[INQUIRER.ESLINT_TYPE];
  config.enableStylelint = options.enableStylelint || (await inquirer.prompt(INQUIRER_VALUE[INQUIRER.ENABLE_STYLELINT]))[INQUIRER.ENABLE_STYLELINT];
};
