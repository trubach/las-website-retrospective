import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('Error: dist/index.html not found. Run build before deploying.');
  process.exit(1);
}

const remoteUrl = execFileSync('git', ['remote', 'get-url', 'origin'], {
  encoding: 'utf8',
}).trim();

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'las-gh-pages-'));

try {
  fs.cpSync(distDir, tmpDir, { recursive: true });
  fs.writeFileSync(path.join(tmpDir, '.nojekyll'), '');

  const runGit = (args) =>
    execFileSync('git', args, {
      cwd: tmpDir,
      stdio: 'inherit',
    });

  runGit(['init', '-b', 'gh-pages']);
  runGit(['add', '-A']);
  runGit([
    '-c',
    'user.name=GitHub Pages Deploy',
    '-c',
    'user.email=223556219+Copilot@users.noreply.github.com',
    'commit',
    '-m',
    'Deploy static site to GitHub Pages\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>',
  ]);
  runGit([
    '-c',
    'credential.helper=!gh auth git-credential',
    'push',
    '--force',
    remoteUrl,
    'HEAD:gh-pages',
  ]);
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
