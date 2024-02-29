import { INQUIRER_VALUE, PKG_NAME, PKG_VALUE, PKG_VERSION } from '../config/constants';
import { spawnSync } from 'child_process';
import ora from 'ora';
import npmType from './npmType';
import { INQUIRER } from '../types';
import inquirer from 'inquirer';
import log from '../utils/log';

const update = (lastVersion: string, currentVersion: string) => {
  const lastVersionList = lastVersion.split('.').map(Number);
  const currentVersionList = currentVersion.split('.').map(Number);
  for (let i = 0; i < currentVersionList.length; i++) {
    const x = currentVersionList[i];
    const y = lastVersionList[i];
    if (x < y) {
      return true;
    } else if (x > y) return false;
  }
  return false;
};

export default async (install: boolean = false) => {
  const loading = ora('更新版本中。。。');
  try {
    loading.start();
    const lastVersion = spawnSync(npmType(), ['view', PKG_NAME, 'version']).stdout.toString().trim();
    // console.log('lastVersion', lastVersion);
    const updateVersionState = update(lastVersion, PKG_VERSION);
    if (!install && updateVersionState) {
      loading.stop();
      const { version } = await inquirer.prompt(INQUIRER_VALUE[INQUIRER.VERSION]);
      install = version;
      loading.start();
    }
    if (install && updateVersionState) {
      log.info(`\n当前版本：${PKG_VERSION}，最新版本：${lastVersion}，准备自动更新`);
      // 通过子线程进行更新 同时将信息打印出来
      // console.log(process.env.PATH);
      const { status } = spawnSync(npmType(), ['install', PKG_NAME], { stdio: 'inherit' });
      if (status) throw new Error('自动更新出错，请手动更新');
    } else if (updateVersionState) {
      log.info(`\n当前版本：${PKG_VERSION}，最新版本：${lastVersion}，请手动更新`);
    } else {
      log.info(`\n当前版本：${PKG_VERSION}，已经是最新版本`);
    }
    loading.succeed('检测更新完成');
    return true;
  } catch (err) {
    log.error(err);
    loading.fail('检测更新失败');
    return false;
  }
};
