// Run from any directory: node /path/to/profile/scripts/preview.mjs
// GitHub renders the README; cached HTML is reused only for the same source.
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep, extname } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const cache = new URL('../.preview/', import.meta.url);
await mkdir(cache, { recursive: true });
const markdown = await readFile(new URL('../README.md', import.meta.url), 'utf8');
const hash = createHash('sha256').update(markdown).digest('hex');
let html, css;
try {
  const metadata = JSON.parse(await readFile(new URL('cache.json', cache), 'utf8'));
  if (metadata.hash === hash) {
    [html, css] = await Promise.all(['rendered.html', 'github-markdown.css'].map(file => readFile(new URL(file, cache), 'utf8')));
  }
} catch { /* A missing cache is normal on the first run. */ }

if (!html || !css) {
  const responses = await Promise.all([
    fetch('https://api.github.com/markdown', {
      method: 'POST',
      headers: { 'User-Agent': 'binhphanbp-profile-preview', 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: markdown, mode: 'gfm' }),
      signal: AbortSignal.timeout(30000),
    }),
    fetch('https://raw.githubusercontent.com/sindresorhus/github-markdown-css/main/github-markdown.css', { signal: AbortSignal.timeout(30000) }),
  ]);
  for (const response of responses) if (!response.ok) throw new Error(`Preview render failed: ${response.url} returned ${response.status}`);
  [html, css] = await Promise.all(responses.map(response => response.text()));
  // The Markdown API omits the heading anchors that GitHub's repository UI adds.
  html = html.replace(/<h([1-6])([^>]*)>(.*?)<\/h\1>/g, (_, level, attrs, label) => {
    const id = label.replace(/<[^>]*>/g, '').toLowerCase().replace(/[^\p{L}\p{N} -]/gu, '').replaceAll(' ', '-');
    return `<h${level}${attrs} id="${id}">${label}</h${level}>`;
  });
  await writeFile(new URL('rendered.html', cache), html);
  await writeFile(new URL('github-markdown.css', cache), css);
  await writeFile(new URL('cache.json', cache), JSON.stringify({ hash }) + '\n');
}

const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bình Phan — GitHub Profile Preview</title><link rel="stylesheet" href="/preview.css"><style>
*{box-sizing:border-box}body{margin:0;background:#0d1117;color:#f0f6fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color-scheme:dark}
header{max-width:1012px;margin:24px auto 0;padding:16px 32px;border:1px solid #30363d;border-bottom:0;border-radius:8px 8px 0 0;font-size:13px;color:#9198a1;display:flex;justify-content:space-between;gap:16px}
header strong{color:#f0f6fc}.markdown-body{max-width:1012px;margin:0 auto 32px;padding:32px;border:1px solid #30363d;border-radius:0 0 8px 8px;min-width:0}
@media(prefers-color-scheme:light){body{background:#fff;color:#1f2328;color-scheme:light}header,.markdown-body{border-color:#d1d9e0}header strong{color:#1f2328}}
@media(max-width:600px){header{margin:0;padding:16px;border-radius:0}.markdown-body{padding:16px;border-radius:0;border-left:0;border-right:0}}
</style></head><body><header><strong>binhphanbp / README.md</strong><span>Local preview · GitHub-rendered Markdown</span></header><article class="markdown-body">${html}</article></body></html>`;
await writeFile(new URL('index.html', cache), page);

const types = { '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    res.setHeader('Cache-Control', 'no-store');
    if (pathname === '/') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(page); return; }
    if (pathname === '/preview.css') { res.writeHead(200, { 'Content-Type': 'text/css' }).end(css); return; }
    if (pathname === '/light') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end('<!doctype html><html lang="en" style="color-scheme:light"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Light theme preview</title><style>body{margin:0}iframe{display:block;border:0;width:100%;height:100vh;color-scheme:light}</style><iframe title="Light theme profile" src="/"></iframe></html>');
      return;
    }
    const file = resolve(root, '.' + pathname);
    if (!pathname.startsWith('/assets/') || !file.startsWith(resolve(root, 'assets') + sep) || !types[extname(file)]) { res.writeHead(404).end(); return; }
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] }).end(bytes);
  } catch { res.writeHead(404).end(); }
});
server.on('error', error => {
  console.error(error.code === 'EADDRINUSE' ? 'Port 4178 is already in use. Stop the existing preview before restarting.' : error.message);
  process.exitCode = 1;
});
server.listen(4178, '127.0.0.1', () => console.log('Profile preview: http://127.0.0.1:4178/\nLight theme: http://127.0.0.1:4178/light\nPress Ctrl+C to stop. Restart after editing README.md.'));
