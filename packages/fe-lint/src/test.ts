import init from './actions/init';
import configCollocate from './utils/configCollocate';

init({
  cwd: process.cwd(),
  checkVersionUpdate: true,
});

configCollocate({
  cwd: '../../../../lint-test',
});
