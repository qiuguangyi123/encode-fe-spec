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
// lint工具扫描每个文件的结果
export interface ScanResult {
  filePath: string;
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  messages: Array<{
    line: number;
    column: number;
    message: string;
    ruleId: string;
    severity: number;
  }>;
}
// scan指令最终导出的结果
export interface ScanReport {
  results: ScanResult[];
  errorCount: number;
  warningCount: number;
  runErrors: Error[];
}

export interface ScanOptions {
  cwd: string;
  include: string;
  files?: string[];
  quiet?: boolean;
  ignore?: boolean;
  fix?: boolean;
  outputReport?: boolean;
  config?: any;
}
