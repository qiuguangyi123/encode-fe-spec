import { PKG, ScanOptions, Config } from '../../types';
import markdownlint from 'markdownlint';
import glob from 'glob';

export default (opts: ScanOptions, pkg: PKG, config: Config) => {
  let markdownLintOptions: markdownlint.Options = {
    resultVersion: 3,
  };
  if (config.markdownlintOptions) {
    markdownLintOptions = Object.assign(markdownLintOptions, config.markdownlintOptions);
  } else {
    const lintFiles = glob.sync('.markdownlint.(yaml|yml|json)', { cwd: opts.cwd });
    if (!lintFiles.length) {
      markdownLintOptions.config = {
        extends: 'markdownlint-config-qgy',
      };
    }
  }
  return markdownLintOptions;
};
