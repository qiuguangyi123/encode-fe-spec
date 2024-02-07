export interface PKG {
  eslintConfig?: any;
  eslintIgnore?: any;
  stylelint?: any;
  peerDependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  [key: string]: any;
}

export interface InitOptions {
  cwd: string;
  // 是否检查并升级 encode-fe-lint 的版本
  checkVersionUpdate: boolean;
  // 是否需要自动重写 lint 配置
  rewriteConfig?: boolean;
  // eslint 类型
  eslintType?: string;
  // 是否启用 ESLint
  enableESLint?: boolean;
  // 是否启用 stylelint
  enableStylelint?: boolean;
  // 是否启用 markdownlint
  enableMarkdownlint?: boolean;
  // 是否启用 prettier
  enablePrettier?: boolean;
  // 是否启用 commitlint
  enableCommitlint?: boolean;
  // 是否禁用自动在初始化完成后安装依赖
  disableNpmInstall?: boolean;
}

export enum NPM_TYPE {
  NPM = 'npm',
  PNPM = 'pnpm',
  NPM_CMD = 'npm.cmd',
  PNPM_CMD = 'pnpm.cmd',
}

export enum INQUIRER {
  VERSION = 'version',
  ESLINT_TYPE = 'eslintType',
  ENABLE_STYLELINT = 'enableStyleLint',
  ENABLE_MARKDOWNLINT = 'enableMarkdownlint',
  ENABLE_PRETTIER = 'enablePrettier',
  ENABLE_COMMITLINT = 'enableCommitlint',
  REWRITE_CONFIG = 'rewriteConfig',
}
