import chalk from 'chalk';
import { PKG_NAME, UNICODE } from '../config/constants';

export default {
  success(text: string) {
    console.log(chalk.green(text));
  },
  info(text: string) {
    console.info(chalk.blue(text));
  },
  warn(text: string) {
    console.warn(chalk.yellow(text));
  },
  error(text: string | Error) {
    console.error(chalk.red(text));
  },
  result(text: string, pass: boolean) {
    console.info(`${PKG_NAME} ${text} ${pass ? chalk.green(UNICODE.success) : chalk.red(UNICODE.failure)}`);
  },
};
