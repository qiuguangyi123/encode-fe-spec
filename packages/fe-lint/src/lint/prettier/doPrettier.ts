import path from 'path';
import { ESLINT_FILE_EXT, PRETTIER_FILE_EXT, PRETTIER_IGNORE_PATTERN } from '../../config/constants';
import { Config, InitOptions, PKG, ScanOptions } from '../../types';
import glob from 'glob';
import { readFile, writeFile } from 'fs-extra';
import prettier from 'prettier';

interface DoEslintOptions extends ScanOptions {
  config: Config;
}
const filesScan = async (filePath: string, config: Config) => {
  const text = await readFile(filePath, 'utf8');
  const prettierConfig = config.prettierOptions || (await (prettier.resolveConfig(filePath) ?? {}));
  const omitText = prettier.format(text, { ...prettierConfig, filepath: filePath });
  await writeFile(filePath, omitText, 'utf-8');
};
export default async (options: DoEslintOptions) => {
  // 要扫描的文件数组
  let files: string[] = [];
  if (options.files) {
    files = options.files.filter((filter) => {
      return PRETTIER_FILE_EXT.includes(path.extname(path.basename(filter)));
    });
  }
  files = files.concat(
    glob
      .sync(`**/*.@(${PRETTIER_FILE_EXT.map((name) => name.replace(/\./gi, '')).join('|')})`, {
        cwd: path.resolve(options.cwd, options.include),
        ignore: options.ignore ? PRETTIER_IGNORE_PATTERN : [],
      })
      .map((file) => path.resolve(options.cwd, options.include, file)),
  );
  await Promise.all(files.map((path) => filesScan(path, options.config)));
};
