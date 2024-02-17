import { sync } from 'command-exists';
import { NPM_TYPE } from '../types';

export default (): NPM_TYPE => {
  const isWindows = /^win/.test(process.platform);
  if (sync(isWindows ? NPM_TYPE.PNPM_CMD : NPM_TYPE.PNPM)) {
    return isWindows ? NPM_TYPE.PNPM_CMD : NPM_TYPE.PNPM;
  }
  return isWindows ? NPM_TYPE.NPM_CMD : NPM_TYPE.NPM;
};
