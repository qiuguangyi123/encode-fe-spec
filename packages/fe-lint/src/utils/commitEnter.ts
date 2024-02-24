import fs from 'fs-extra';
import log from './log';
import path from 'path';
import { InitOptions } from '../types';
import { PKG_NAME } from '../config/constants';

export default (options: Pick<InitOptions, 'cwd'>) => {
  log.info('配置 git commit 卡点');
  const pkgPath = path.resolve(options.cwd, 'package.json');
  const pkgContent = fs.readJSONSync(pkgPath);
  if (!pkgContent.scripts) pkgContent.scripts = {};
  if (!pkgContent.husky) pkgContent.husky = {};
  if (!pkgContent.husky.hooks) pkgContent.husky.hooks = {};
  // 注入husky 在提交前和提交后进行文件和提交注释的校验
  const lintName = PKG_NAME;

  pkgContent.scripts[`${lintName}-scan`] = `${lintName} scan`;
  pkgContent.scripts[`${lintName}-fix`] = `${lintName} fix`;

  pkgContent.husky.hooks['pre-commit'] = `${lintName} commit-file-scan`;
  pkgContent.husky.hooks['commit-msg'] = `${lintName} commit-msg-scan`;
  // console.log(Buffer.call(pkgContent));
  fs.writeFileSync(pkgPath, Buffer.from(JSON.stringify(pkgContent)));
  log.success('配置 git commit 卡点成功');
};
