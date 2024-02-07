import { INQUIRER_VALUE } from '../config/constants';
import { INQUIRER, InitOptions } from '../types';
import updateVersion from '../utils/updateVersion';
import inquirer from 'inquirer';
import log from '../utils/log';
import configCollocate from '../utils/configCollocate';
import renderTemplate from '../utils/renderTemplate';
export default async (options: InitOptions) => {
  const isTest = process.env.NODE_ENV === 'test';
  const config: Omit<InitOptions, 'cwd' | 'checkVersionUpdate'> = {};
  if (options.checkVersionUpdate && !isTest) {
    await updateVersion();
  }

  // 构建各个配置是否需要数据
  config.enableESLint = options.enableESLint || true;
  config.eslintType =
    options.eslintType || (await inquirer.prompt(INQUIRER_VALUE[INQUIRER.ESLINT_TYPE]))[INQUIRER.ESLINT_TYPE];
  config.enableStylelint =
    options.enableStylelint ||
    (await inquirer.prompt(INQUIRER_VALUE[INQUIRER.ENABLE_STYLELINT]))[INQUIRER.ENABLE_STYLELINT];
  config.enableMarkdownlint =
    options.enableMarkdownlint ||
    (await inquirer.prompt(INQUIRER_VALUE[INQUIRER.ENABLE_MARKDOWNLINT]))[INQUIRER.ENABLE_MARKDOWNLINT];
  config.enablePrettier =
    options.enablePrettier ||
    (await inquirer.prompt(INQUIRER_VALUE[INQUIRER.ENABLE_PRETTIER]))[INQUIRER.ENABLE_PRETTIER];
  config.enableCommitlint =
    options.enableCommitlint ||
    (await inquirer.prompt(INQUIRER_VALUE[INQUIRER.ENABLE_COMMITLINT]))[INQUIRER.ENABLE_COMMITLINT];
  if (!isTest) {
    // 归置目前存在的配置
    log.info('准备开始检查是否有配置冲突～');
    await configCollocate({ cwd: options.cwd, rewriteConfig: options.rewriteConfig });
    log.info('检查配置冲突完成！');
  }
  // 渲染模板
  renderTemplate(options.cwd, config);
};
