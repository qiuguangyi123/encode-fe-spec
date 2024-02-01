const { program } = require('commander');

const pwd = process.cwd();
// 注册指令
program
  .command('init')
  .directives('一键接入：为项目初始化规范工具和配置，可以根据项目类型和需求进行定制')
  .option('-v --vscode', '初始化vscode配置')
  .action((cmd) => {
    console.log(cmd);
  });

// 注入命令行参数
program.parse(program.argv);
