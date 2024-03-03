import chalk from 'chalk';
import { ScanReport, ScanResult } from '../types';
import os from 'os';
import table from 'text-table';
import stripAnsi from 'strip-ansi';
import terminalLink from 'terminal-link';
import isDocker from 'is-docker';
import { PKG_NAME, UNICODE } from '../config/constants';

export default (result: ScanResult[], fix: boolean) => {
  let fixWarningsCount: number = 0;
  let fixErrorsCount: number = 0;
  let errorCount: number = 0;
  let warningCount: number = 0;
  let summaryColor = 'yellow';
  const eol = os.EOL;
  let output: string = `${eol}`;
  // 转为table可以识别的格式
  function transformMessage({ line, column, rule, url, message, errored }, index: number) {
    let text = '';
    if (rule && url) {
      text = terminalLink(chalk.blue(rule), url, { fallback: !isDocker() });
    }
    if (rule) {
      text = chalk.blue(rule);
    }
    return [
      `${index + 1}.`,
      chalk.dim(`line:${line}.column:${column}`),
      `${errored ? chalk.red('error') : chalk.yellow('warning')}`,
      `${text}`,
      message.trim(),
    ];
  }
  // 获取到每个文件的错误信息
  for (let i of result) {
    if (i.messages.length <= 0) continue;
    errorCount += i.errorCount;
    warningCount += i.warningCount;
    fixErrorsCount += i.fixableErrorCount;
    fixWarningsCount += i.fixableWarningCount;
    output += `${chalk.blue(i.filePath)}${eol}`;
    // 拿到每一条错误 将文件的错误信息转为table格式;
    output += table(i.messages.map(transformMessage), {
      align: ['.', '.', 'l', 'l', 'l'],
      stringLength: (str: string) => stripAnsi(str).length,
    });
    output += `${eol}${eol}`;
  }
  if (errorCount) summaryColor = 'red';
  if (fix) {
    output += chalk.green(`代码规范问题自动修复完成，请通过 git diff 确认修复效果 :D${eol}`);
    if (errorCount || warningCount)
      output += chalk[summaryColor](`上面所打印的内容为无法自动修复的问题，请手动修复${eol}`);
  } else {
    if (errorCount || warningCount) {
      output += chalk[summaryColor](
        `errorCount:${errorCount} warningsCount:${warningCount}${eol}fixableErrorCount:${fixErrorsCount} fixableWarningCount:${fixWarningsCount}${eol}`,
      );
      output += chalk[summaryColor](`potentially fixable with the \` ${PKG_NAME} scan -f\``);
    } else output = chalk.green.bold(`${UNICODE.success} no problems`);
  }
  console.log(output);
};
