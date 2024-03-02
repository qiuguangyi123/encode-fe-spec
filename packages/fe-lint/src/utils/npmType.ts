import { sync } from 'command-exists';
import { NPM_TYPE } from '../types';

export default (type: string = 'pnpm'): NPM_TYPE => {
  const isWindows = /^win/.test(process.platform);
  if (type === 'pnpm' && sync(isWindows ? NPM_TYPE.PNPM_CMD : NPM_TYPE.PNPM)) {
    return isWindows ? NPM_TYPE.PNPM_CMD : NPM_TYPE.PNPM;
  }
  return isWindows ? NPM_TYPE.NPM_CMD : NPM_TYPE.NPM;
};
