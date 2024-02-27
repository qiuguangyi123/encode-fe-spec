import path from 'path';
import fg from 'fast-glob';
import { readFile, writeFile } from 'fs-extra';
import { MARKDOWN_LINT_FILE_EXT, MARKDOWN_LINT_IGNORE_PATTERN } from '../../config/constants';
import { InitOptions, PKG, ScanOptions, ScanResult } from '../../types';
import glob from 'glob';
import markdownlint, { LintError } from 'markdownlint';
import getMarkdownlintConfig from './getMarkdownlintConfig';
import markdownlintRuleHelpers from 'markdownlint-rule-helpers';
import formatMarkdownlintResults from './formatMarkdownlintResults';

interface DoMarkdownlintOptions extends ScanOptions {
  pkg: PKG;
  config: Omit<InitOptions, 'cwd' | 'checkVersionUpdate' | 'disableNpmInstall' | 'rewriteConfig'>;
}

async function formatMarkdownFile(filename: string, errors: LintError[]) {
  const fixes = errors?.filter((error) => error.fixInfo);

  if (fixes?.length > 0) {
    const originalText = await readFile(filename, 'utf8');
    const fixedText = markdownlintRuleHelpers.applyFixes(originalText, fixes);
    if (originalText !== fixedText) {
      await writeFile(filename, fixedText, 'utf8');
      return errors.filter((error) => !error.fixInfo);
    }
  }
  return errors;
}

export default async (options: DoMarkdownlintOptions): Promise<ScanResult[]> => {
  if (options.config.enableMarkdownlint === false) return [];
  // 要扫描的文件数组
  let files: string[] = [];
  if (options.files) {
    files = options.files.filter((filter) => {
      return MARKDOWN_LINT_FILE_EXT.includes(path.extname(path.basename(filter)));
    });
  }

  files = files.concat(
    glob
      .sync(`**/*.@(${MARKDOWN_LINT_FILE_EXT.map((name) => name.replace(/\./gi, '')).join('|')})`, {
        cwd: path.resolve(options.cwd, options.include),
        ignore: options.ignore ? MARKDOWN_LINT_IGNORE_PATTERN : [],
      })
      .map((file) => path.resolve(options.cwd, options.include, file)),
  );
  const results = await markdownlint.promises.markdownlint({
    ...getMarkdownlintConfig(options, options.pkg, options.config),
    files,
  });
  // 修复
  if (options.fix || true) {
    await Promise.all(
      Object.keys(results).map(async (filename) => {
        results[filename] = await formatMarkdownFile(filename, results[filename]);
      }),
    );
  }
  return formatMarkdownlintResults(results, options.quiet);
};
