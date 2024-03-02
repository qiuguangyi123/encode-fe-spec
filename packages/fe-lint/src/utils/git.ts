import execa from 'execa';
import os from 'os';
const eol = os.EOL;
export const gitDiffStaged = async (options: execa.Options) => {
  const { stdout } = await execa(
    'git',
    [
      'diff',
      '--staged', // 比较 暂缓区 与 last commit 的差别
      '--diff-filter=ACMR', // 只显示 added、copied、modified、renamed
      '--name-only', // 只显示更改文件的名称
      '--ignore-submodules',
    ],
    {
      cwd: process.cwd(),
      all: true,
      ...options,
    },
  );
  return stdout.split('\n');
};

// 比较 工作区 与 最近一次提交的差别
export const gitDiffNameOnly = async (options: execa.Options) => {
  const { stdout } = await execa('git', ['diff', '--name-only'], {
    cwd: process.cwd(),
    all: true,
    ...options,
  });
  return stdout ? stdout.split('\n') : null;
};
