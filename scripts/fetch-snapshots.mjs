import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CACHE_DIR = join(process.cwd(), '.cache', 'wayback-raw');
mkdirSync(CACHE_DIR, { recursive: true });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function curlGet(url, maxTimeSec = 25) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const out = execFileSync(
        'curl',
        [
          '-4',
          '--compressed',
          '-sSL',
          '--fail',
          '--max-time',
          String(maxTimeSec),
          '-A',
          'Mozilla/5.0 (X11; Linux x86_64) LASRetrospectiveArchiver/1.0',
          url,
        ],
        { maxBuffer: 25 * 1024 * 1024 }
      );
      return out.toString('utf-8');
    } catch (err) {
      lastErr = err;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, attempt * 3000);
    }
  }
  throw lastErr;
}

function fetchCdx(domain) {
  const cacheFile = join(CACHE_DIR, `cdx-${domain}.json`);
  if (existsSync(cacheFile)) {
    return JSON.parse(readFileSync(cacheFile, 'utf-8'));
  }
  const url = `https://web.archive.org/cdx/search/cdx?url=${domain}/&output=json&fl=timestamp,original,statuscode,digest,length&filter=statuscode:200&collapse=timestamp:6`;
  const raw = curlGet(url, 30);
  const parsed = JSON.parse(raw).slice(1);
  writeFileSync(cacheFile, JSON.stringify(parsed, null, 2));
  return parsed;
}

function scoreTimestampForEarlyFall(ts) {
  const month = Number(ts.slice(4, 6));
  const day = Number(ts.slice(6, 8));
  const dayOfYearApprox = (month - 1) * 30 + day;
  const target = (10 - 1) * 30 + 1; // Oct 1
  let distance = Math.abs(dayOfYearApprox - target);
  // Slightly prefer Sept/Oct over earlier pre-academic-year months
  if (month === 9 || month === 10) distance -= 25;
  return distance;
}

function normalizeDisplayHost(year) {
  if (year <= 2007) return 'www.las.uiuc.edu';
  if (year <= 2018) return 'www.las.illinois.edu';
  return 'las.illinois.edu';
}

async function main() {
  console.log('Fetching Wayback CDX catalogs...');
  const uiucRows = fetchCdx('www.las.uiuc.edu');
  await sleep(1200);
  const illinoisRows = fetchCdx('www.las.illinois.edu');

  const byYearUiuc = new Map();
  for (const row of uiucRows) {
    const y = Number(row[0].slice(0, 4));
    if (!byYearUiuc.has(y)) byYearUiuc.set(y, []);
    byYearUiuc.get(y).push(row);
  }

  const byYearIllinois = new Map();
  for (const row of illinoisRows) {
    const y = Number(row[0].slice(0, 4));
    if (!byYearIllinois.has(y)) byYearIllinois.set(y, []);
    byYearIllinois.get(y).push(row);
  }

  const manifest = [];

  for (let year = 2000; year <= 2026; year++) {
    // ADR 0005: *.illinois.edu takes canonical precedence from Aug 2008 onward
    let candidates = year >= 2008 ? byYearIllinois.get(year) || [] : byYearUiuc.get(year) || [];

    if (year >= 2019) {
      // Prefer bare las.illinois.edu captures from 2019+ when available
      const bare = candidates.filter((r) => {
        try {
          const u = new URL(r[1]);
          return u.hostname === 'las.illinois.edu';
        } catch {
          return false;
        }
      });
      if (bare.length > 0) candidates = bare;
    }

    candidates.sort((a, b) => scoreTimestampForEarlyFall(a[0]) - scoreTimestampForEarlyFall(b[0]));
    const chosen = candidates[0];
    if (!chosen) {
      throw new Error(`No Wayback HTTP 200 candidate found for year ${year}`);
    }

    const [timestamp, originalUrl, , digest, byteLength] = chosen;
    const htmlPath = join(CACHE_DIR, `${year}-${timestamp}.html`);
    const idUrl = `https://web.archive.org/web/${timestamp}id_/${originalUrl}`;
    const waybackUrl = `https://web.archive.org/web/${timestamp}/${originalUrl}`;

    if (!existsSync(htmlPath)) {
      console.log(`[${year}] Downloading ${idUrl} ...`);
      const html = curlGet(idUrl, 30);
      writeFileSync(htmlPath, html, 'utf-8');
      await sleep(2200);
    } else {
      console.log(`[${year}] Cached (${timestamp})`);
    }

    manifest.push({
      year,
      timestamp,
      dateFormatted: `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(6, 8)}`,
      originalUrl,
      canonicalHost: normalizeDisplayHost(year),
      waybackUrl,
      idUrl,
      digest,
      compressedLength: Number(byteLength),
      htmlCacheFile: `${year}-${timestamp}.html`,
    });
  }

  // Also cache live https://las.illinois.edu/ HTML
  const liveHtmlPath = join(CACHE_DIR, 'live-2026.html');
  if (!existsSync(liveHtmlPath)) {
    console.log('[live] Downloading https://las.illinois.edu/ ...');
    const liveHtml = curlGet('https://las.illinois.edu/', 20);
    writeFileSync(liveHtmlPath, liveHtml, 'utf-8');
  }

  const manifestPath = join(CACHE_DIR, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Saved manifest with ${manifest.length} annual snapshots to ${manifestPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
