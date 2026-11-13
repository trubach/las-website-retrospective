import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as cheerio from 'cheerio';

const CACHE_DIR = join(process.cwd(), '.cache', 'wayback-raw');
const manifest = JSON.parse(readFileSync(join(CACHE_DIR, 'manifest.json'), 'utf-8'));

function cleanText(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function inspectYear(year, html) {
  const $ = cheerio.load(html);
  const title = cleanText($('title').first().text());

  if (year === 2000) {
    // 2000 flat table directory
    const sections = [];
    $('b, strong, h2, h3, font').each((_, el) => {
      const txt = cleanText($(el).text());
      if (['College Information', 'Program and Course Information', 'External Relations'].includes(txt)) {
        sections.push(txt);
      }
    });
    const allLinks = [];
    $('a[href]').each((_, a) => {
      const label = cleanText($(a).text());
      const href = $(a).attr('href');
      if (label) allLinks.push({ label, href });
    });
    return { year, title, allLinks };
  }

  if (year >= 2001 && year <= 2004) {
    // 2001-2004 7-table graphical layout + JS menu arrays if inline
    const allLinks = [];
    $('a[href]').each((_, a) => {
      const label = cleanText($(a).text() || $(a).find('img').attr('alt') || '');
      const href = $(a).attr('href');
      if (label && allLinks.length < 30) allLinks.push({ label, href });
    });
    return { year, title, allLinks };
  }

  if (year >= 2005 && year <= 2007) {
    // 2005-2007 table + /css/las.css + optional #nav / mainnav.css
    const navTree = [];
    $('ul li').each((_, li) => {
      if ($(li).parents('li').length > 0) return;
      const a = $(li).children('a').first();
      const label = cleanText(a.text() || a.find('img').attr('alt') || '');
      const href = a.attr('href') || '';
      const sub = [];
      $(li).find('ul li a').each((__, sa) => {
        sub.push({ label: cleanText($(sa).text()), href: $(sa).attr('href') || '' });
      });
      if (label) navTree.push({ label, href, sub });
    });
    const topLinks = [];
    $('a[href]').each((_, a) => {
      const label = cleanText($(a).text() || $(a).find('img').attr('alt') || '');
      const href = $(a).attr('href');
      if (label && topLinks.length < 35) topLinks.push({ label, href });
    });
    return { year, title, navTree: navTree.slice(0, 15), topLinks };
  }

  if (year >= 2008 && year <= 2013) {
    // ATLAS screen.css layout
    const zones = {};
    $('ul, div[id*="nav"], div[class*="nav"]').each((_, el) => {
      const idCls = `${$(el).attr('id') || ''}.${$(el).attr('class') || ''}`;
      const directLinks = [];
      $(el).children('li, a').each((__, child) => {
        const a = $(child).is('a') ? $(child) : $(child).children('a').first();
        const label = cleanText(a.text() || a.find('img').attr('alt') || '');
        const href = a.attr('href') || '';
        const sub = [];
        if (!$(child).is('a')) {
          $(child).find('ul li a').each((___, sa) => {
            sub.push({ label: cleanText($(sa).text()), href: $(sa).attr('href') || '' });
          });
        }
        if (label) directLinks.push({ label, href, sub });
      });
      if (directLinks.length > 0) zones[idCls] = directLinks;
    });
    return { year, title, zones };
  }

  if (year >= 2014 && year <= 2018) {
    // Bootstrap 3 + las-dropdown mega-menu
    const utility = [];
    $('header ul li a, .nav-top a, .utility a, .top-nav a, .navbar a, ul.list-inline a').each((_, a) => {
      if ($(a).closest('.las-dropdown').length > 0) return;
      const label = cleanText($(a).text() || $(a).attr('title') || '');
      const href = $(a).attr('href') || '';
      if (label) utility.push({ label, href });
    });
    const mega = [];
    $('ul.las-dropdown > li').each((_, li) => {
      const topA = $(li).children('a').first();
      const label = cleanText(topA.text());
      const href = topA.attr('href') || '';
      const sub = [];
      $(li).find('.las-nav-panel a').each((__, sa) => {
        const sl = cleanText($(sa).text());
        if (sl) sub.push({ label: sl, href: $(sa).attr('href') || '' });
      });
      mega.push({ label, href, sub });
    });
    return { year, title, utility, mega };
  }

  if (year >= 2019 && year <= 2024) {
    // Drupal 8/9/10 pre-Illinois-Web-Theme
    const navBlocks = [];
    $('header nav, nav[id], .region-header nav, .region-navigation nav, header ul').each((_, el) => {
      if ($(el).is('ul') && $(el).closest('nav').length > 0) return;
      const id = $(el).attr('id') || $(el).attr('aria-label') || $(el).attr('class') || 'header-list';
      const items = [];
      const topUl = $(el).is('ul') ? $(el) : $(el).find('ul').first();
      topUl.children('li').each((__, li) => {
        const a = $(li).children('a, span').first();
        const label = cleanText(a.text());
        const href = a.attr('href') || '';
        const sub = [];
        $(li).find('ul li a').each((___, sa) => {
          const sl = cleanText($(sa).text());
          if (sl) sub.push({ label: sl, href: $(sa).attr('href') || '' });
        });
        if (label) items.push({ label, href, sub });
      });
      if (items.length > 0) navBlocks.push({ id, items });
    });
    // Also grab direct header CTA links outside nav
    const headerDirectLinks = [];
    $('header a').each((_, a) => {
      if ($(a).closest('nav').length > 0) return;
      const label = cleanText($(a).text());
      const href = $(a).attr('href') || '';
      if (label && !label.startsWith('.a{')) headerDirectLinks.push({ label, href });
    });
    // Check footer menus for displaced audience blocks
    const footerMenus = [];
    $('footer nav').each((_, fnav) => {
      const heading = cleanText($(fnav).find('h2, h3').first().text()) || $(fnav).attr('aria-label') || $(fnav).attr('id');
      const items = [];
      $(fnav).find('a').each((__, fa) => {
        const fl = cleanText($(fa).text());
        if (fl) items.push({ label: fl, href: $(fa).attr('href') || '' });
      });
      footerMenus.push({ heading, items });
    });
    return { year, title, headerDirectLinks, navBlocks, footerMenus };
  }

  // 2025-2026 Illinois Web Theme (<ilw-header>)
  const utility = [];
  $('ilw-header nav[slot="links"] a, ilw-header ul[slot="links"] a, ilw-header > ul a').each((_, a) => {
    utility.push({ label: cleanText($(a).text()), href: $(a).attr('href') || '' });
  });
  const primary = [];
  $('ilw-header-menu-section').each((_, sec) => {
    const topA = $(sec).children('a[slot="link"], span[slot="link"]').first();
    const label = cleanText(topA.text());
    const href = topA.attr('href') || '';
    const sub = [];
    $(sec).find('ul li a').each((__, sa) => {
      sub.push({ label: cleanText($(sa).text()), href: $(sa).attr('href') || '' });
    });
    primary.push({ label, href, sub });
  });
  const footerMenus = [];
  $('footer nav, nav[id*="footer"]').each((_, fnav) => {
    const heading = cleanText($(fnav).find('h2, h3').first().text()) || $(fnav).attr('id');
    const items = [];
    $(fnav).find('a').each((__, fa) => {
      const fl = cleanText($(fa).text());
      if (fl) items.push({ label: fl, href: $(fa).attr('href') || '' });
    });
    footerMenus.push({ heading, items });
  });
  return { year, title, utility, primary, footerMenus };
}

const argYears = process.argv.find((a) => a.startsWith('--years='));
const filterSet = argYears
  ? new Set(argYears.replace('--years=', '').split(',').map((n) => Number(n.trim())))
  : null;

for (const entry of manifest) {
  if (filterSet && !filterSet.has(entry.year)) continue;
  const html =
    entry.year === 2026
      ? readFileSync(join(CACHE_DIR, 'live-2026.html'), 'utf-8')
      : readFileSync(join(CACHE_DIR, entry.htmlCacheFile), 'utf-8');
  console.log(JSON.stringify(inspectYear(entry.year, html), null, 2));
}
