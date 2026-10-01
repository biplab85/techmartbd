/* ==========================================================================
   Generates index.html — a contact-sheet gallery of everything in out/.

     node make-gallery.js

   The page is written as static HTML rather than reading the folder at run
   time: opened straight off the disk as file://, a page cannot list a
   directory or fetch a manifest, and this gallery needs to work by
   double-clicking it. Re-run after adding or renaming banners.
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const OUT = path.join(DIR, 'out');

/* Placement buckets, matched on the WxH suffix in the file name. Order here
   is the order of the sections on the page. */
const GROUPS = [
  { title: 'Feed posts',   note: '1200×630 — feed and link shares', test: s => s === '1200x630' },
  { title: 'Square posts', note: '1080×1080 — feed and carousel',   test: s => s === '1080x1080' },
  { title: 'Page covers',  note: '1640×856 — page cover photo',     test: s => s === '1640x856' },
  { title: 'Stories',      note: '1080×1920 — story and reel',      test: s => s === '1080x1920' },
  { title: 'Earlier set',  note: 'previous dark-theme banners',     test: () => true },
];

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Title Case a slug: fb-07-warranty-trust-1200x630 -> "Warranty Trust" */
function pretty(name) {
  return name
    .replace(/\.png$/, '')
    .replace(/-\d+x\d+$/, '')
    .replace(/^fb-/, '')
    .replace(/^\d+-/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const files = fs.existsSync(OUT)
  ? fs.readdirSync(OUT).filter(f => f.toLowerCase().endsWith('.png')).sort()
  : [];

if (!files.length) {
  console.error('No PNGs in out/ — run `node render.js` first.');
  process.exit(1);
}

/* Bucket the files, first matching group wins. */
const buckets = GROUPS.map(g => ({ ...g, items: [] }));
for (const f of files) {
  const m = f.match(/-(\d+x\d+)\.png$/);
  const size = m ? m[1] : '';
  (buckets.find(b => b.test(size)) || buckets[buckets.length - 1]).items.push({ f, size });
}

const LOGO = `
<svg class="mark" viewBox="0 0 236 72" role="img" aria-label="TechCartBD">
  <defs>
    <linearGradient id="gbar" gradientUnits="userSpaceOnUse" x1="11" y1="21" x2="46.9" y2="15">
      <stop offset="0" stop-color="#109450"/><stop offset=".21" stop-color="#269146"/>
      <stop offset=".48" stop-color="#609C26"/><stop offset=".75" stop-color="#83BA0E"/>
      <stop offset="1" stop-color="#86BD08"/></linearGradient>
    <linearGradient id="gstem" gradientUnits="userSpaceOnUse" x1="26.5" y1="24" x2="26.5" y2="58.8">
      <stop offset="0" stop-color="#067F57"/><stop offset=".6" stop-color="#046E65"/>
      <stop offset="1" stop-color="#036474"/></linearGradient>
    <linearGradient id="garm" gradientUnits="userSpaceOnUse" x1="56" y1="13.4" x2="56" y2="24">
      <stop offset="0" stop-color="#10905A"/><stop offset="1" stop-color="#0C8150"/></linearGradient>
    <linearGradient id="ghook" gradientUnits="userSpaceOnUse" x1="38" y1="25.2" x2="70.8" y2="58.8">
      <stop offset="0" stop-color="#7FB80A"/><stop offset=".28" stop-color="#519827"/>
      <stop offset=".48" stop-color="#03795F"/><stop offset="1" stop-color="#016270"/></linearGradient>
  </defs>
  <path fill="url(#gbar)" d="M11 13.4H46.86L38.61 24H11Z"/>
  <path fill="url(#gstem)" d="M21 24h11v34.8H21z"/>
  <path fill="url(#garm)" d="M49.86 13.4H71.86L63.61 24H41.61Z"/>
  <path fill="url(#ghook)" d="M38 25.2H48.5V44.7A3.6 3.6 0 0 0 52.1 48.3H70.8L63.8 58.8H52.1A14.1 14.1 0 0 1 38 44.7Z"/>
  <text x="84" y="39.5" font-family="Montserrat, Segoe UI, Arial, sans-serif" font-size="21.4"
        font-weight="800" letter-spacing="-0.3" textLength="129.5" lengthAdjust="spacing">
    <tspan fill="#12303B">TECH</tspan><tspan fill="#7AB80C">CART</tspan><tspan fill="#12303B">BD</tspan></text>
  <text x="85" y="57.5" font-family="Montserrat, Segoe UI, Arial, sans-serif" font-size="11.4"
        font-weight="500" letter-spacing="0.15" fill="#5A6E74"
        textLength="83.5" lengthAdjust="spacing">techcartbd.com</text>
</svg>`;

const sections = buckets.filter(b => b.items.length).map(b => `
  <section class="sec">
    <div class="sec-h">
      <h2>${esc(b.title)}</h2>
      <p>${esc(b.note)} · ${b.items.length} banner${b.items.length > 1 ? 's' : ''}</p>
    </div>
    <div class="grid">
${b.items.map(({ f, size }) => `      <a class="card" href="out/${esc(f)}" data-fancybox="banners"
         data-caption="${esc(pretty(f))} · ${esc(size)} · ${esc(f)}">
        <span class="shot"><img src="out/${esc(f)}" alt="${esc(pretty(f))}" loading="lazy"></span>
        <span class="meta"><b>${esc(pretty(f))}</b><i>${esc(size)}</i></span>
      </a>`).join('\n')}
    </div>
  </section>`).join('\n');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>TechCartBD · Banner Gallery</title>
<!-- Inline favicon: without one the browser requests /favicon.ico and logs a
     404 on every load, which is noise in an otherwise clean console. -->
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72 72'%3E%3Crect width='72' height='72' rx='14' fill='%230A4A50'/%3E%3Cpath fill='%238FD00E' d='M14 18h30l-7 9H14Z'/%3E%3Cpath fill='%23F3F8EE' d='M22 27h9v29h-9z'/%3E%3Cpath fill='%2312A165' d='M46 18h14l-7 9H39Z'/%3E%3Cpath fill='%238FD00E' d='M36 28h9v17a3 3 0 0 0 3 3h12l-6 9H48a12 12 0 0 1-12-12Z'/%3E%3C/svg%3E">
<link rel="stylesheet" href="vendor/fancybox/fancybox.css">
<style>
  @font-face {
    font-family: 'Montserrat';
    src: url('fonts/Montserrat-latin-var.woff2') format('woff2');
    font-weight: 100 900; font-style: normal; font-display: swap;
  }
  :root {
    --lime: #7AB80C; --lime-hi: #8FD00E; --teal: #0A4A50;
    --navy: #12303B; --slate: #5A6E74; --line: #DFE6E1; --paper: #F1F5F1;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: var(--paper); color: var(--navy);
    font-family: 'Montserrat', 'Segoe UI', system-ui, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* ---- header ---- */
  header {
    background: #fff; border-bottom: 1px solid var(--line);
    padding: 30px 40px 26px;
    display: flex; align-items: center; gap: 26px; flex-wrap: wrap;
  }
  .mark { height: 56px; width: auto; display: block; }
  header .tag {
    padding-bottom: 4px; font-size: 14px; font-weight: 600; color: var(--slate);
    border-left: 1px solid var(--line); padding-left: 26px;
  }
  .all-button {
    margin-left: auto; padding: 10px 22px; border: 0; border-radius: 999px;
    background: var(--teal); color: #fff; cursor: pointer; font: inherit;
    font-size: 13px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
  }
  .all-button:hover { background: var(--lime); }
  .contact { margin-left: auto; display: flex; align-items: center; gap: 22px; }
  .contact a {
    display: inline-flex; align-items: center; gap: 8px; color: var(--slate);
    font-size: 12px; font-weight: 700; text-decoration: none; white-space: nowrap;
  }
  .contact a:hover { color: var(--teal); }
  .contact svg { width: 17px; height: 17px; fill: none; stroke: var(--lime); stroke-width: 1.8;
    stroke-linecap: round; stroke-linejoin: round; }

  /* ---- category image sections ---- */
  .category-sections { max-width: 1680px; margin: 0 auto; padding: 28px 40px 0; }
  .category-section + .category-section { margin-top: 42px; }
  .category-section h2 {
    margin-bottom: 16px; padding-left: 14px; border-left: 5px solid var(--lime-hi);
    font-size: 20px; font-weight: 800; text-transform: uppercase;
  }
  .category-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
  .category-card { position: relative; display: block; color: inherit; text-decoration: none; }
  .category-card img {
    display: block; width: 100%; aspect-ratio: 1 / 1; object-fit: contain;
    padding: 10px; background: #fff; border: 1px solid var(--line); border-radius: 10px;
    transition: border-color .16s ease, box-shadow .16s ease, transform .16s ease;
  }
  .category-card:hover img {
    border-color: var(--lime-hi); transform: translateY(-3px);
    box-shadow: 0 16px 30px -18px rgba(10,60,50,.55);
  }
  .category-card .product-badge {
    position: absolute; top: 14px; left: 14px; z-index: 1;
    display: inline-flex; align-items: baseline; gap: 4px;
    min-width: 76px; padding: 8px 12px; border: 2px solid var(--lime-hi);
    border-radius: 8px; background: var(--teal); color: #fff;
    font-size: 20px; font-weight: 900; line-height: 1; letter-spacing: .04em;
    box-shadow: 0 8px 18px -8px rgba(4,25,27,.85), 0 0 0 3px rgba(255,255,255,.7);
    text-shadow: 0 1px 2px rgba(4,25,27,.5);
  }
  .category-card .product-badge::before {
    content: 'NO.'; color: var(--lime-hi); font-size: 11px; letter-spacing: .1em;
  }

  .mobile-app-bar { display: none; }

  /* ---- sections ---- */
  main { padding: 40px; max-width: 1680px; margin: 0 auto; }
  .sec + .sec { margin-top: 52px; }
  .sec-h { display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
  .sec-h h2 {
    font-size: 20px; font-weight: 800; letter-spacing: -.01em; text-transform: uppercase;
    padding-left: 14px; border-left: 5px solid var(--lime-hi); line-height: 1.1;
  }
  .sec-h p { font-size: 14px; font-weight: 500; color: var(--slate); }

  /* ---- grid ---- */
  .grid { display: grid; gap: 22px; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); }
  .card { display: block; text-decoration: none; color: inherit; }
  /* Fixed-ratio well with object-fit:contain, because one grid holds
     1200x630, 1080x1080 and 1080x1920 art — cropping to fill would hide
     the composition of exactly the tall ones worth checking. */
  .shot {
    display: grid; place-items: center; aspect-ratio: 16 / 10; overflow: hidden;
    background: #fff; border: 1px solid var(--line); border-radius: 12px;
    transition: border-color .16s ease, box-shadow .16s ease, transform .16s ease;
  }
  .shot img { max-width: 100%; max-height: 100%; display: block; }
  .card:hover .shot {
    border-color: var(--lime-hi); transform: translateY(-3px);
    box-shadow: 0 16px 30px -18px rgba(10,60,50,.55);
  }
  .meta { display: flex; align-items: baseline; gap: 10px; padding: 11px 3px 0; }
  .meta b { font-size: 14px; font-weight: 700; letter-spacing: -.01em; }
  .meta i {
    margin-left: auto; font-style: normal; font-size: 12px; font-weight: 600;
    letter-spacing: .06em; color: var(--slate);
  }

  footer {
    padding: 30px 40px 50px; text-align: center;
    font-size: 13px; font-weight: 500; color: var(--slate);
  }

  @media (max-width: 640px) {
    html { scroll-padding-bottom: 76px; }
    body { padding-bottom: 76px; }
    header { padding: 16px 18px; gap: 14px; }
    .mark { height: 42px; }
    .contact { display: none; }
    .all-button { margin-left: auto; padding: 9px 18px; }
    main { padding: 24px 18px; }
    .grid { grid-template-columns: 1fr; }
    .category-sections { padding: 24px 18px 0; }
    .category-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .category-section + .category-section { margin-top: 32px; }
    .category-section h2 { font-size: 17px; margin-bottom: 12px; }
    .category-card img { padding: 6px; border-radius: 8px; }
    .category-card .product-badge { top: 9px; left: 9px; min-width: 62px; padding: 7px 9px; font-size: 16px; }
    .category-card .product-badge::before { font-size: 9px; }
    .mobile-app-bar {
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 20;
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px;
      padding: 8px 10px calc(8px + env(safe-area-inset-bottom));
      background: rgba(255,255,255,.96); border-top: 1px solid var(--line);
      box-shadow: 0 -10px 26px -18px rgba(10,60,50,.7); backdrop-filter: blur(12px);
    }
    .mobile-app-bar a {
      display: grid; justify-items: center; gap: 4px; color: var(--slate);
      text-decoration: none; font-size: 10px; font-weight: 800; letter-spacing: .04em;
      text-transform: uppercase;
    }
    .mobile-app-bar a:first-child, .mobile-app-bar a:hover { color: var(--teal); }
    .mobile-app-bar svg { width: 21px; height: 21px; fill: none; stroke: currentColor;
      stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  }
</style>
</head>
<body>

<header>
  ${LOGO}
  <button class="all-button" type="button" data-scroll-to="gallery">All</button>
  <nav class="contact" aria-label="Contact information">
    <a href="mailto:milonmallick55@gmail.com">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
      milonmallick55@gmail.com
    </a>
    <a href="tel:+8801933834282">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5 9 3l2 4.7-2.1 1.6a14.2 14.2 0 0 0 5.8 5.8l1.6-2.1 4.7 2-0.5 4c-1.2.1-2.4-.3-3.3-1.1l-4.9-4.9a4.8 4.8 0 0 1-1.1-3.3z"/></svg>
      +880 1933-834282
    </a>
    <a href="https://techcartbd.com" target="_blank" rel="noreferrer">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>
      techcartbd.com
    </a>
  </nav>
</header>

<section class="category-sections" aria-label="Featured categories">
  <section class="category-section" id="sourcing">
    <h2>Sourcing</h2>
    <div class="category-grid">
      ${[['1', 'webp'], ['2', 'webp'], ['3', 'webp'], ['4', 'webp'], ['5', 'webp'], ['6', 'jpeg'], ['7', 'jpeg']].map(([n, ext]) => `<a class="category-card" href="image/headphone/${n}.${ext}" data-fancybox="category-images" data-caption="${n}"><img src="image/headphone/${n}.${ext}" alt="${n}"><span class="product-badge">${n}</span></a>`).join('')}
    </div>
  </section>
  <section class="category-section" id="upcoming">
    <h2>Upcoming</h2>
    <div class="category-grid">
      ${[2, 3, 4, 5, 1, 2, 3, 4].map((n, i) => `<a class="category-card" href="image/${n}.svg" data-fancybox="category-images" data-caption="Upcoming ${i + 1}"><img src="image/${n}.svg" alt="Upcoming image ${i + 1}"></a>`).join('')}
    </div>
  </section>
  <section class="category-section" id="offer">
    <h2>Offer</h2>
    <div class="category-grid">
      ${[3, 4, 5, 1, 2, 3, 4, 5].map((n, i) => `<a class="category-card" href="image/${n}.svg" data-fancybox="category-images" data-caption="Offer ${i + 1}"><img src="image/${n}.svg" alt="Offer image ${i + 1}"></a>`).join('')}
    </div>
  </section>
</section>

<main id="gallery">
${sections}
</main>

<footer>TechCartBD · generated by make-gallery.js · re-run after adding banners</footer>

<nav class="mobile-app-bar" aria-label="Mobile gallery navigation">
  <a href="#gallery" aria-label="Show all banners">
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
    <span>All</span>
  </a>
  <a href="#sourcing" aria-label="Go to sourcing">
    <svg viewBox="0 0 24 24"><path d="M4 8.5 12 4l8 4.5L12 13 4 8.5Z"/><path d="m4 12 8 4.5 8-4.5M4 15.5l8 4.5 8-4.5"/></svg>
    <span>Sourcing</span>
  </a>
  <a href="#upcoming" aria-label="Go to upcoming">
    <svg viewBox="0 0 24 24"><path d="M4 17V7l8-4 8 4v10l-8 4-8-4Z"/><path d="M4 7l8 4 8-4M12 11v10"/></svg>
    <span>Upcoming</span>
  </a>
  <a href="#offer" aria-label="Go to offers">
    <svg viewBox="0 0 24 24"><path d="m20 13-7 7H6a3 3 0 0 1-3-3v-7l7-7h5l5 5v5Z"/><circle cx="9" cy="9" r="1.2"/></svg>
    <span>Offer</span>
  </a>
</nav>

<script src="vendor/fancybox/fancybox.umd.js"></script>
<script>
  document.querySelector('[data-scroll-to="gallery"]').addEventListener('click', () => {
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
  });
  Fancybox.bind('[data-fancybox="banners"], [data-fancybox="category-images"]', {
    Toolbar: { display: { left: ['infobar'], middle: [], right: ['slideshow', 'fullscreen', 'download', 'close'] } },
    Images: { Panzoom: { maxScale: 3 } }
  });
</script>

</body>
</html>
`;

fs.writeFileSync(path.join(DIR, 'index.html'), html, 'utf8');
console.log(`index.html written — ${files.length} banners in ${buckets.filter(b => b.items.length).length} sections`);
