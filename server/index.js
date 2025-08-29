/* Simple bootstrap server: clone, install, and run repos locally */
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const projectsRoot = path.resolve(process.cwd(), 'projects');
if (!fs.existsSync(projectsRoot)) fs.mkdirSync(projectsRoot, { recursive: true });

/** @type {Record<string, { cwd: string; proc: import('child_process').ChildProcess | null; logs: string[]; url: string | null; status: 'idle'|'cloning'|'installing'|'starting'|'running'|'error'; error?: string }>} */
const stateByRepo = Object.create(null);

const getState = (repo) => {
  if (!stateByRepo[repo]) {
    stateByRepo[repo] = { cwd: path.join(projectsRoot, repo), proc: null, logs: [], url: null, status: 'idle' };
  }
  return stateByRepo[repo];
};

const appendLog = (s, line) => {
  s.logs.push(line);
  if (s.logs.length > 2000) s.logs.shift();
  const match = line.match(/(http:\/\/localhost:\d+[^\s]*)/i);
  if (match && !s.url) {
    s.url = match[1];
  }
};

const run = (cmd, args, options) => new Promise((resolve, reject) => {
  const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], ...options });
  let out = '';
  child.stdout.on('data', (d) => { out += d.toString(); });
  child.stderr.on('data', (d) => { out += d.toString(); });
  child.on('error', reject);
  child.on('close', (code) => {
    if (code === 0) resolve(out);
    else reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`));
  });
});

const ensureRepo = async (owner, repo, branch) => {
  const s = getState(repo);
  const cwd = s.cwd;
  const repoUrl = `https://github.com/${owner}/${repo}.git`;
  if (!fs.existsSync(cwd)) {
    s.status = 'cloning';
    await run('git', ['clone', branch ? '-b' : '', branch || '', repoUrl, cwd].filter(Boolean));
  } else {
    // fetch & pull latest
    await run('git', ['pull', '--ff-only'], { cwd });
  }
  return cwd;
};

const detectPackageManager = (cwd) => {
  if (fs.existsSync(path.join(cwd, 'bun.lockb'))) return { pm: 'bun', install: ['install'], dev: ['run', 'dev'] };
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return { pm: 'pnpm', install: ['install'], dev: ['run', 'dev'] };
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return { pm: 'yarn', install: ['install'], dev: ['run', 'dev'] };
  return { pm: 'npm', install: ['install'], dev: ['run', 'dev'] };
};

const startDevServer = async (repo) => {
  const s = getState(repo);
  if (s.proc) return s;
  const pkgPath = path.join(s.cwd, 'package.json');
  if (!fs.existsSync(pkgPath)) throw new Error('package.json not found');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const pm = detectPackageManager(s.cwd);
  s.status = 'installing';
  await run(pm.pm, pm.install, { cwd: s.cwd });
  const devScript = (pkg.scripts && (pkg.scripts.dev || pkg.scripts.start || pkg.scripts['serve'])) ? (pkg.scripts.dev ? ['run', 'dev'] : pkg.scripts.start ? ['start'] : ['run', 'serve']) : pm.dev;
  s.status = 'starting';
  const child = spawn(pm.pm, devScript, { cwd: s.cwd, env: { ...process.env } });
  s.proc = child;
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (d) => appendLog(s, d.toString()));
  child.stderr.on('data', (d) => appendLog(s, d.toString()));
  child.on('close', (code) => {
    appendLog(s, `process exited with code ${code}`);
    s.proc = null;
    s.status = code === 0 ? 'idle' : 'error';
  });
  // wait a bit to capture first URL
  setTimeout(() => {
    if (s.url && s.status !== 'error') s.status = 'running';
  }, 4000);
  return s;
};

app.post('/api/bootstrap', async (req, res) => {
  const { repo, owner = 'NXConner', branch } = req.body || {};
  if (!repo) return res.status(400).json({ error: 'repo required' });
  const s = getState(repo);
  try {
    if (!s.proc && s.status !== 'starting' && s.status !== 'installing') {
      await ensureRepo(owner, repo, branch);
      startDevServer(repo).catch((err) => {
        s.status = 'error';
        s.error = String(err.message || err);
      });
    }
    res.json({ status: s.status, url: s.url });
  } catch (e) {
    s.status = 'error';
    s.error = String(e.message || e);
    res.status(500).json({ error: s.error });
  }
});

app.get('/api/status', (req, res) => {
  const repo = req.query.repo;
  if (!repo || typeof repo !== 'string') return res.status(400).json({ error: 'repo required' });
  const s = getState(repo);
  res.json({ status: s.status, url: s.url, running: s.status === 'running' });
});

app.post('/api/stop', (req, res) => {
  const { repo } = req.body || {};
  const s = getState(repo);
  if (s.proc) {
    s.proc.kill();
    s.proc = null;
    s.status = 'idle';
    s.url = null;
  }
  res.json({ ok: true });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`[bootstrap] listening on http://localhost:${port}`);
});

