import { INQUIRER_VALUE, PKG_NAME } from '../config/constants';
import { INQUIRER, InitOptions } from '../types';
import updateVersion from '../utils/updateVersion';
import inquirer from 'inquirer';
import log from '../utils/log';
import configCollocate from '../utils/configCollocate';
import renderTemplate from '../utils/renderTemplate';
import commitEnter from '../utils/commitEnter';
import os from 'os';
import { spawnSync } from 'child_process';
import npmType from '../utils/npmType';
export default async (options: InitOptions) => {
  try {
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
      if (!options.disableNpmInstall) {
        const installNpm = npmType();
        spawnSync(installNpm, ['install'], { stdio: 'inherit' });
        spawnSync(installNpm, ['install', PKG_NAME], { stdio: 'inherit' });
        if (config.enableStylelint)
          spawnSync(installNpm, ['install', 'stylelint-config-qgy', '-D'], { stdio: 'inherit' });
        if (config.enableMarkdownlint)
          spawnSync(installNpm, ['install', 'markdownlint-config-qgy', '-D'], { stdio: 'inherit' });
        if (config.enableCommitlint)
          spawnSync(installNpm, ['install', 'commitlint-config-qgy', '-D'], { stdio: 'inherit' });
      }
      log.info('检查配置冲突完成！');
    }
    // 卡点
    commitEnter({ cwd: options.cwd });
    log.info('开始写入配置文件');
    // 渲染模板
    renderTemplate(options.cwd, config);
    log.success('写入配置文件成功');
    const logs = [`${PKG_NAME} 初始化成功！`].join(os.EOL);
    log.success(logs);
  } catch (err) {
    console.log(err);
    log.error('出错了，请稍后再试～');
    process.exit(1);
  }
};
