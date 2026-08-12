/* ==========================================================================
   TECHCARTBD — banner renderer

     node render.js            re-export all 20 banners to out/
     node render.js fb-11      re-export only the ones matching "fb-11"

   Each banner's pixel size is read from its file name suffix (…-1200x630),
   so a new banner needs no edit here — name it fb-<n>-<slug>-<W>x<H>.html
   and it is picked up on the next run.

   It serves the folder over http on 8742 rather than opening file:// URLs:
   the product-photo fallback in assets.js relies on an image 404, and
   file:// gives inconsistent error events across Chrome builds.
   ========================================================================== */
const { chromium } = require('playwright-core');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const OUT = path.join(DIR, 'out');

/* Chromium: prefer a PLAYWRIGHT_CHROMIUM env override, else the newest
   chromium-* Playwright has already downloaded, else system Chrome. */
function findChrome() {
  if (process.env.PLAYWRIGHT_CHROMIUM) return process.env.PLAYWRIGHT_CHROMIUM;
  const base = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  if (fs.existsSync(base)) {
    const builds = fs.readdirSync(base)
      .filter(d => /^chromium-\d+$/.test(d))
      .sort((a, b) => +b.split('-')[1] - +a.split('-')[1]);
    for (const b of builds) {
      const exe = path.join(base, b, 'chrome-win64', 'chrome.exe');
      if (fs.existsSync(exe)) return exe;
    }
  }
  const sys = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  if (fs.existsSync(sys)) return sys;
  throw new Error('No Chromium found. Set PLAYWRIGHT_CHROMIUM to a chrome.exe.');
}

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
               '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
               '.webp': 'image/webp', '.woff2': 'font/woff2' };

function serve() {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
      const file = path.join(DIR, rel);
      if (!file.startsWith(DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404); return res.end('not found');
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    /* Port 0 = let the OS pick a free one. A fixed port fails outright if
       anything else on the machine already holds it. */
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

(async () => {
  const filter = process.argv[2] || '';
  /* Any .html whose name ends in -WxH is a banner, which covers both the fb-*
     set and the earlier dark-theme banners in this folder. Files starting with
     _ are partials and are skipped. */
  const files = fs.readdirSync(DIR)
    .filter(f => /-\d+x\d+\.html$/.test(f) && !f.startsWith('_') && f.includes(filter))
    .sort();

  if (!files.length) { console.log(`no banners match "${filter}"`); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });

  const srv = await serve();
  const PORT = srv.address().port;
  const browser = await chromium.launch({
    executablePath: findChrome(),
    args: ['--no-sandbox', '--disable-gpu', '--disable-background-networking',
           '--disable-dev-shm-usage', '--font-render-hinting=none']
  });

  let ok = 0, bad = 0;
  console.log('rendering:');
  for (const f of files) {
    const m = f.match(/-(\d+)x(\d+)\.html$/);
    if (!m) { console.log(`  SKIP  ${f}  (no WxH in file name)`); continue; }
    const width = +m[1], height = +m[2];
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    try {
      await page.goto(`http://127.0.0.1:${PORT}/${f}`, { waitUntil: 'load', timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);
      await page.screenshot({
        path: path.join(OUT, f.replace(/\.html$/, '.png')),
        clip: { x: 0, y: 0, width, height }
      });
      console.log(`  ok    ${f.replace(/\.html$/, '.png')}  ${width}x${height}`);
      ok++;
    } catch (e) {
      console.log(`  FAIL  ${f}  ${e.message.split('\n')[0]}`);
      bad++;
    }
    await page.close();
  }

  await browser.close();
  srv.close();
  console.log(`\n${ok} rendered${bad ? `, ${bad} failed` : ''} → out/`);
})();
