import { execFileSync, spawnSync } from 'node:child_process';

const [command, ...commandArgs] = process.argv.slice(2);

if (!command) {
  console.error('A command is required.');
  process.exit(1);
}

let statusOutput;

try {
  statusOutput = execFileSync(
    'git',
    ['status', '--porcelain=v1', '--untracked-files=all'],
    {
      encoding: 'utf8',
    },
  );
} catch (error) {
  console.error('Unable to determine changed files with Git.', error.message);
  process.exit(1);
}

const changedFiles = statusOutput
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => {
    const path = line.slice(3).trim();
    return path.includes(' -> ') ? path.split(' -> ').pop() : path;
  })
  .filter((filePath) => filePath !== 'package-lock.json')
  .filter((filePath) => !/^(node_modules|dist|\.git)[\\/]/.test(filePath))
  .filter((filePath) => {
    if (command === 'eslint') {
      return /\.js$|\.jsx$/.test(filePath);
    }

    return /\.(c|m)?js$|\.jsx$|\.css$|\.html$|\.json$|\.md$/.test(filePath);
  });

if (changedFiles.length === 0) {
  console.log(`No changed files found for ${command}.`);
  process.exit(0);
}

const executable = process.platform === 'win32' ? `${command}.cmd` : command;
const result = spawnSync(executable, [...commandArgs, ...changedFiles], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) {
  console.error(`Unable to run ${command}.`, result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
