import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import https from 'node:https';
import http from 'node:http';
import { join } from 'node:path';
import { brotliDecompressSync, gunzipSync, inflateSync } from 'node:zlib';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const CACHE_DIR = join(process.cwd(), '.cache', 'wayback-raw');
const ASSET_CACHE_DIR = join(process.cwd(), '.cache', 'wayback-assets');
const OUT_DIR = join(process.cwd(), 'public', 'screenshots');
mkdirSync(ASSET_CACHE_DIR, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

const CHROMIUM_EXEC = '/home/trubach/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome';

// Persistent IPv4 keep-alive pool (2 sockets) for web.archive.org to avoid connection-rate throttling
const waybackAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 2,
  family: 4,
  timeout: 22000,
});

const liveHttpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 4,
  family: 4,
  timeout: 15000,
});

const BLOCKED_SUBSTRINGS = [
  'wbstatic.archive.org',
  'web-static.archive.org',
  'archive.org/includes/',
  'google-analytics.com',
  'googletagmanager.com',
  'doubleclick.net',
  'facebook.net',
  'facebook.com/tr',
  'platform.twitter.com',
  'htmlcommentbox.com',
  'siteimproveanalytics.com',
  'chartbeat.net',
  'youtube.com/embed',
  'player.vimeo.com',
  'addthis.com',
  'sharethis.com',
  'cookielaw.org',
  'onetrust.com',
  'onetrust.techservices.illinois.edu',
  'google_tag/js/',
  'enroll.illinois.edu/ping',
  'marketing.publicaffairs.illinois.edu',
  'emergency.webservices.illinois.edu',
];

const DIRECT_LIVE_CDNS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
  'netdna.bootstrapcdn.com',
  'maxcdn.bootstrapcdn.com',
  'use.fontawesome.com',
  'cdn.toolkit.illinois.edu',
  'cdn.brand.illinois.edu',
  'code.jquery.com',
  'ajax.googleapis.com',
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

let lastWaybackFetchAt = 0;
let waybackChain = Promise.resolve();

function enqueueWaybackFetch(fn) {
  const next = waybackChain.then(async () => {
    const elapsed = Date.now() - lastWaybackFetchAt;
    if (elapsed < 280) {
      await sleep(280 - elapsed);
    }
    lastWaybackFetchAt = Date.now();
  });
  waybackChain = next.catch(() => {});
  return next.then(() => fn());
}

function guessContentType(url, headerCt, buf) {
  const clean = url.split('?')[0].toLowerCase();
  if (clean.endsWith('.css')) return 'text/css; charset=utf-8';
  if (clean.endsWith('.js') || clean.endsWith('.mjs')) return 'application/javascript; charset=utf-8';
  if (clean.endsWith('.svg')) return 'image/svg+xml';
  if (clean.endsWith('.png')) return 'image/png';
  if (clean.endsWith('.gif')) return 'image/gif';
  if (clean.endsWith('.webp')) return 'image/webp';
  if (clean.endsWith('.woff2')) return 'font/woff2';
  if (clean.endsWith('.woff')) return 'font/woff';
  if (clean.endsWith('.ttf')) return 'font/ttf';
  if (clean.endsWith('.jpg') || clean.endsWith('.jpeg')) return 'image/jpeg';
  if (headerCt && typeof headerCt === 'string' && !headerCt.includes('octet-stream')) {
    return headerCt;
  }
  if (buf.length >= 4) {
    if (buf[0] === 0x89 && buf[1] === 0x50) return 'image/png';
    if (buf[0] === 0xff && buf[1] === 0xd8) return 'image/jpeg';
    if (buf[0] === 0x47 && buf[1] === 0x49) return 'image/gif';
    const head = buf.subarray(0, 160).toString('utf-8').trimStart();
    if (head.startsWith('<svg') || head.startsWith('<?xml')) return 'image/svg+xml';
    if (head.startsWith('<!DOCTYPE') || head.startsWith('<html') || head.startsWith('<HTML')) {
      return 'text/html; charset=utf-8';
    }
  }
  return 'application/octet-stream';
}

function httpGetFollow(targetUrl, useWaybackAgent, redirectsLeft = 6) {
  return new Promise((resolve) => {
    let parsed;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return resolve({ code: 400, body: Buffer.alloc(0), headers: {} });
    }
    const isHttps = parsed.protocol === 'https:';
    const mod = isHttps ? https : http;
    const agent = isHttps ? (useWaybackAgent ? waybackAgent : liveHttpsAgent) : undefined;

    const req = mod.get(
      targetUrl,
      {
        agent,
        family: 4,
        timeout: useWaybackAgent ? 22000 : 12000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) LASRetrospectiveArchiver/1.0',
          'Accept-Encoding': 'gzip, deflate, br',
          Accept: '*/*',
        },
      },
      (res) => {
        const status = res.statusCode || 0;
        if ([301, 302, 303, 307, 308].includes(status) && res.headers.location && redirectsLeft > 0) {
          res.resume();
          const nextUrl = new URL(res.headers.location, targetUrl).toString();
          return resolve(httpGetFollow(nextUrl, nextUrl.includes('web.archive.org'), redirectsLeft - 1));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          let buf = Buffer.concat(chunks);
          const enc = (res.headers['content-encoding'] || '').toLowerCase();
          try {
            if (enc === 'gzip' || (buf.length > 2 && buf[0] === 0x1f && buf[1] === 0x8b)) {
              buf = gunzipSync(buf);
            } else if (enc === 'br') {
              buf = brotliDecompressSync(buf);
            } else if (enc === 'deflate') {
              buf = inflateSync(buf);
            }
          } catch {}
          resolve({ code: status, body: buf, headers: res.headers });
        });
        res.on('error', () => resolve({ code: 0, body: Buffer.alloc(0), headers: {} }));
      }
    );
    req.on('timeout', () => {
      req.destroy();
      resolve({ code: 0, body: Buffer.alloc(0), headers: {} });
    });
    req.on('error', () => resolve({ code: 0, body: Buffer.alloc(0), headers: {} }));
  });
}

async function fetchSubresource(assetUrl, timestamp, isLiveMode) {
  const normalizedAssetUrl = assetUrl.replace(':80/', '/');
  const isDirectCdn = isLiveMode || DIRECT_LIVE_CDNS.some((d) => normalizedAssetUrl.includes(d));
  const isHashedImmutable = /\/(css|js)_[A-Za-z0-9_-]{20,}\.(css|js)/.test(normalizedAssetUrl);

  const cacheKey =
    isDirectCdn || isHashedImmutable
      ? `direct:${normalizedAssetUrl.split('?')[0]}`
      : `wb:${timestamp.slice(0, 4)}:${normalizedAssetUrl}`;

  const hash = createHash('sha256').update(cacheKey).digest('hex').slice(0, 32);
  const binPath = join(ASSET_CACHE_DIR, `${hash}.bin`);
  const metaPath = join(ASSET_CACHE_DIR, `${hash}.json`);

  if (existsSync(metaPath) && existsSync(binPath)) {
    const meta = JSON.parse(readFileSync(metaPath, 'utf-8'));
    return {
      status: meta.status,
      body: meta.status === 200 ? readFileSync(binPath) : Buffer.alloc(0),
      contentType: meta.contentType,
    };
  }

  if (isDirectCdn) {
    const liveUrl = normalizedAssetUrl.startsWith('http://')
      ? normalizedAssetUrl.replace('http://', 'https://')
      : normalizedAssetUrl;
    const { code, body, headers } = await httpGetFollow(liveUrl, false);
    if (code >= 200 && code < 300 && body.length > 0) {
      const contentType = guessContentType(normalizedAssetUrl, headers['content-type'], body);
      writeFileSync(binPath, body);
      writeFileSync(metaPath, JSON.stringify({ url: liveUrl, status: 200, contentType }));
      return { status: 200, body, contentType };
    }
    return { status: 404, body: Buffer.alloc(0), contentType: 'text/plain' };
  }

  return enqueueWaybackFetch(async () => {
    if (existsSync(metaPath) && existsSync(binPath)) {
      const meta = JSON.parse(readFileSync(metaPath, 'utf-8'));
      return {
        status: meta.status,
        body: meta.status === 200 ? readFileSync(binPath) : Buffer.alloc(0),
        contentType: meta.contentType,
      };
    }

    const candidateAssetUrls = [normalizedAssetUrl];
    if (normalizedAssetUrl.includes('?')) {
      candidateAssetUrls.push(normalizedAssetUrl.split('?')[0]);
    }

    for (const candidate of candidateAssetUrls) {
      const wbUrl = `https://web.archive.org/web/${timestamp}id_/${candidate}`;
      for (let attempt = 1; attempt <= 3; attempt++) {
        const { code, body, headers } = await httpGetFollow(wbUrl, true);
        if (code >= 200 && code < 300 && body.length > 0) {
          const contentType = guessContentType(candidate, headers['content-type'], body);
          if (
            contentType.startsWith('text/html') &&
            !candidate.endsWith('.html') &&
            !candidate.endsWith('.htm')
          ) {
            break; // Soft 404 HTML wrapper
          }
          writeFileSync(binPath, body);
          writeFileSync(metaPath, JSON.stringify({ url: wbUrl, status: 200, contentType }));
          return { status: 200, body, contentType };
        }
        if (code === 404 || code === 410 || code === 403) {
          break; // Try stripped-query fallback if available
        }
        const backoffMs = attempt * 6000;
        console.warn(`    [backoff] HTTP ${code} on ${candidate.slice(0, 72)} — sleeping ${backoffMs}ms...`);
        await sleep(backoffMs);
      }
    }

    writeFileSync(binPath, Buffer.alloc(0));
    writeFileSync(metaPath, JSON.stringify({ url: normalizedAssetUrl, status: 404, contentType: 'text/plain' }));
    return { status: 404, body: Buffer.alloc(0), contentType: 'text/plain' };
  });
}

async function renderEntry(browser, entry, force) {
  const foldOut = join(OUT_DIR, `${entry.year}-fold.webp`);
  const fullOut = join(OUT_DIR, `${entry.year}-full.webp`);
  const reportPath = join(CACHE_DIR, 'capture-report.json');
  const existingReport = existsSync(reportPath) ? JSON.parse(readFileSync(reportPath, 'utf-8')) : {};

  if (!force && existsSync(foldOut) && existsSync(fullOut) && existingReport[entry.year]) {
    console.log(`[${entry.year}] Already captured, skipping.`);
    return;
  }

  const isLive2026 = entry.year === 2026;
  const pageOriginUrl = isLive2026
    ? 'https://las.illinois.edu/'
    : entry.originalUrl.replace(':80/', '/');
  const htmlFile = isLive2026
    ? join(CACHE_DIR, 'live-2026.html')
    : join(CACHE_DIR, entry.htmlCacheFile);
  const rawHtml = readFileSync(htmlFile, 'utf-8');

  console.log(`[${entry.year}] Rendering ${pageOriginUrl} (ts=${entry.timestamp}) ...`);

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  let inflight = 0;

  await page.route('**/*', async (route) => {
    const reqUrl = route.request().url();
    const resType = route.request().resourceType();

    if (reqUrl.startsWith('data:') || reqUrl.startsWith('blob:')) {
      return route.continue();
    }
    if (
      reqUrl === pageOriginUrl ||
      (resType === 'document' && reqUrl.replace(/\/$/, '') === pageOriginUrl.replace(/\/$/, ''))
    ) {
      return route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: rawHtml,
      });
    }
    if (BLOCKED_SUBSTRINGS.some((s) => reqUrl.includes(s))) {
      return route.abort();
    }
    if (resType === 'media' || resType === 'websocket' || resType === 'eventsource') {
      return route.abort();
    }
    if (
      resType === 'script' &&
      entry.year < 2024 &&
      !DIRECT_LIVE_CDNS.some((d) => reqUrl.includes(d))
    ) {
      return route.abort();
    }

    inflight++;
    try {
      const res = await fetchSubresource(reqUrl, entry.timestamp, isLive2026);
      if (res.status !== 200) {
        return await route.fulfill({ status: 404, body: '' });
      }
      return await route.fulfill({
        status: 200,
        headers: {
          'Content-Type': res.contentType,
          'Access-Control-Allow-Origin': '*',
        },
        body: res.body,
      });
    } finally {
      inflight--;
    }
  });

  await page.goto(pageOriginUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Eager-load any lazy images so full-page screenshots don't miss below-the-fold photos
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.setAttribute('loading', 'eager');
    });
  });

  // Wait until subresources finish (or max 75s) with 900ms idle settle
  const deadline = Date.now() + 75000;
  let quietTicks = 0;
  while (Date.now() < deadline) {
    if (inflight === 0) {
      quietTicks++;
      if (quietTicks >= 4) break;
    } else {
      quietTicks = 0;
    }
    await sleep(300);
  }
  await page.waitForTimeout(isLive2026 || entry.year >= 2025 ? 1200 : 500);

  // Dismiss campus cookie dialog if any script rendered one
  try {
    const closeBtn = page.locator('button:has-text("Close Cookie Notice")');
    if ((await closeBtn.count()) > 0) {
      await closeBtn.first().click({ timeout: 1500 });
      await page.waitForTimeout(250);
    }
  } catch {}

  const audit = await page.evaluate(() => {
    const selectorsToRemove = [
      '#wm-ipp-base',
      '#wm-ipp',
      '#donato',
      '#onetrust-banner-sdk',
      '.eu-cookie-compliance-banner',
      '#cookie-notice',
      '[id*="cookie-banner"]',
      '.cc-window',
    ];
    for (const sel of selectorsToRemove) {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    }
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
      html { background: #ffffff; }
      .las-nav-panel { display: none !important; }
    `;
    document.head.appendChild(style);
    window.scrollTo(0, 0);

    const imgs = Array.from(document.querySelectorAll('img'));
    const visibleImgs = imgs.filter((img) => {
      const r = img.getBoundingClientRect();
      const st = window.getComputedStyle(img);
      return (
        st.display !== 'none' &&
        st.visibility !== 'hidden' &&
        (r.width > 12 || r.height > 12 || img.hasAttribute('width'))
      );
    });
    const brokenImages = visibleImgs.filter((img) => !img.complete || img.naturalWidth === 0).length;
    const flashCount = document.querySelectorAll(
      'object[type*="flash"], embed[type*="flash"], embed[src*=".swf"], object[data*=".swf"], param[value*=".swf"]'
    ).length;
    const docHeight = Math.max(
      document.body?.scrollHeight || 0,
      document.documentElement?.scrollHeight || 0
    );
    return {
      title: document.title,
      docHeight,
      totalVisibleImages: visibleImgs.length,
      brokenImages,
      flashCount,
    };
  });

  await page.waitForTimeout(200);
  const foldPng = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: 1280, height: 900 },
  });

  const clampedHeight = Math.min(Math.max(audit.docHeight, 900), 5000);
  await page.setViewportSize({ width: 1280, height: clampedHeight });
  await page.waitForTimeout(250);
  const fullPng = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: 1280, height: clampedHeight },
  });

  await sharp(foldPng).webp({ quality: 84 }).toFile(foldOut);
  await sharp(fullPng).webp({ quality: 80 }).toFile(fullOut);

  const freshReport = existsSync(reportPath) ? JSON.parse(readFileSync(reportPath, 'utf-8')) : {};
  freshReport[entry.year] = {
    ...audit,
    capturedFullHeight: clampedHeight,
  };
  writeFileSync(reportPath, JSON.stringify(freshReport, null, 2));
  console.log(
    `  -> [${entry.year}] OK (h=${clampedHeight}px, visibleImgs=${audit.totalVisibleImages}, brokenImgs=${audit.brokenImages}, flash=${audit.flashCount})`
  );

  await context.close();
}

async function main() {
  const manifest = JSON.parse(readFileSync(join(CACHE_DIR, 'manifest.json'), 'utf-8'));
  const argYears = process.argv.find((a) => a.startsWith('--years='));
  const force = process.argv.includes('--force');
  const filterSet = argYears
    ? new Set(
        argYears
          .replace('--years=', '')
          .split(',')
          .map((n) => Number(n.trim()))
      )
    : null;

  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXEC,
    headless: true,
    args: ['--disable-ipv6', '--no-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    for (const entry of manifest) {
      if (filterSet && !filterSet.has(entry.year)) continue;
      await renderEntry(browser, entry, force);
    }
  } finally {
    await browser.close();
    waybackAgent.destroy();
    liveHttpsAgent.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
