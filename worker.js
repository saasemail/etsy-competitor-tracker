export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;
    const sessionId = request.headers.get('x-session-id') || 'anon';
    // Basic CORS for frontend
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id'
    };
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    try {
      if (pathname === '/api/targets/add' && request.method === 'POST') {
        return await handleAdd(request, env, sessionId, corsHeaders);
      } else if (pathname.startsWith('/api/targets/refresh/') && request.method === 'POST') {
        const id = decodeURIComponent(pathname.split('/').pop());
        return await handleRefresh(id, env, sessionId, corsHeaders);
      } else if (pathname === '/api/targets/list') {
        return await handleList(env, sessionId, corsHeaders);
      } else if (pathname.startsWith('/api/targets/') && pathname.endsWith('/history')) {
        const parts = pathname.split('/');
        const id = parts[3];
        return await handleHistory(id, env, sessionId, corsHeaders);
      } else if (pathname === '/api/cron/refresh') {
        return await handleCron(env, corsHeaders);
      }
    } catch (err) {
      return json({ error: 'Server error' }, corsHeaders, 500);
    }
    return json({ error: 'Not found' }, corsHeaders, 404);
  }
};

function json(body, headers = {}, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
}

// In-memory stores for demo; replace with KV/D1 in production.
const TARGETS = new Map();
const SNAPSHOTS = new Map();
const USER_TARGET_IDS = new Map(); // sessionId -> array of target IDs
const LAST_ID = { value: 0 };

function nextId() {
  LAST_ID.value += 1;
  return LAST_ID.value.toString();
}

async function handleAdd(request, env, sessionId, corsHeaders) {
  const { url } = await request.json();
  const normalized = normalizeUrl(url);
  // Rate limit: allow only a few adds per hour per session
  // For demo, skip real rate limit
  // Parse listing/shop
  const fetchRes = await fetch(normalized, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!fetchRes.ok) {
    return json({ error: 'Failed to fetch target' }, corsHeaders, 400);
  }
  const html = await fetchRes.text();
  const parsed = parseEtsy(html);
  if (!parsed.title) {
    return json({ error: 'Could not parse the provided URL' }, corsHeaders, 400);
  }
  const id = nextId();
  const now = Date.now();
  const target = {
    id,
    url,
    normalizedUrl: normalized,
    type: normalized.includes('/listing/') ? 'listing' : 'shop',
    title: parsed.title,
    image: parsed.image,
    currentPrice: parsed.price,
    tags: parsed.tags,
    createdAt: now,
    updatedAt: now,
    lastChangeAt: now,
    status: 'ok'
  };
  TARGETS.set(id, target);
  USER_TARGET_IDS.set(sessionId, [...(USER_TARGET_IDS.get(sessionId) || []), id]);
  // Create initial snapshot
  const snap = {
    id: `${id}-0`,
    targetId: id,
    ts: now,
    title: parsed.title,
    price: parsed.price,
    tags: parsed.tags,
    image: parsed.image
  };
  SNAPSHOTS.set(id, [snap]);
  return json(target, corsHeaders);
}

async function handleRefresh(id, env, sessionId, corsHeaders) {
  const target = TARGETS.get(id);
  if (!target) return json({ error: 'Target not found' }, corsHeaders, 404);
  // Fetch and parse
  try {
    const resp = await fetch(target.normalizedUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!resp.ok) {
      target.status = 'stale';
      return json({ error: 'Failed to refresh' }, corsHeaders, 400);
    }
    const html = await resp.text();
    const parsed = parseEtsy(html);
    // Compare with latest snapshot
    const snaps = SNAPSHOTS.get(id) || [];
    const lastSnap = snaps[snaps.length - 1];
    const fieldsChanged = [];
    if (parsed.title && parsed.title !== lastSnap.title) fieldsChanged.push('title');
    if (parsed.price && parsed.price !== lastSnap.price) fieldsChanged.push('price');
    // Compare tags arrays (string join)
    if (parsed.tags && parsed.tags.join(',') !== (lastSnap.tags || []).join(',')) fieldsChanged.push('tags');
    const summaryParts = [];
    fieldsChanged.forEach(f => {
      summaryParts.push(`${f} changed`);
    });
    const summary = summaryParts.join(', ');
    const ts = Date.now();
    // Update target
    target.title = parsed.title;
    target.image = parsed.image;
    target.currentPrice = parsed.price;
    target.tags = parsed.tags;
    target.updatedAt = ts;
    if (fieldsChanged.length) target.lastChangeAt = ts;
    TARGETS.set(id, target);
    // Add snapshot to ring buffer (max 30)
    const newSnap = {
      id: `${id}-${snaps.length}`,
      targetId: id,
      ts,
      title: parsed.title,
      price: parsed.price,
      tags: parsed.tags,
      image: parsed.image
    };
    snaps.push(newSnap);
    if (snaps.length > 30) snaps.shift();
    SNAPSHOTS.set(id, snaps);
    const diff = { fieldsChanged, summary, old: lastSnap, new: newSnap };
    return json({ target, diff }, corsHeaders);
  } catch (err) {
    target.status = 'error';
    return json({ error: 'Error parsing target' }, corsHeaders, 500);
  }
}

async function handleList(env, sessionId, corsHeaders) {
  const ids = USER_TARGET_IDS.get(sessionId) || [];
  const results = ids.map(id => {
    const t = TARGETS.get(id);
    const snaps = SNAPSHOTS.get(id) || [];
    const lastDiff = snaps.length > 1 ? computeLastDiff(snaps) : null;
    return {
      id: t.id,
      title: t.title,
      image: t.image,
      currentPrice: t.currentPrice,
      lastChange: lastDiff,
      priceHistory: snaps.map(s => parseFloat(s.price)).filter(n => !isNaN(n))
    };
  });
  return json(results, corsHeaders);
}

async function handleHistory(id, env, sessionId, corsHeaders) {
  const snaps = SNAPSHOTS.get(id) || [];
  const diffs = [];
  for (let i = 1; i < snaps.length; i++) {
    diffs.push(computeDiff(snaps[i - 1], snaps[i]));
  }
  return json({ snapshots: snaps, diffs }, corsHeaders);
}

async function handleCron(env, corsHeaders) {
  // In a real deployment this would be triggered by Cloudflare cron; here we just refresh all
  for (const id of TARGETS.keys()) {
    await handleRefresh(id, env, 'system', corsHeaders);
  }
  return json({ ok: true }, corsHeaders);
}

function computeLastDiff(snaps) {
  const prev = snaps[snaps.length - 2];
  const curr = snaps[snaps.length - 1];
  return computeDiff(prev, curr);
}

function computeDiff(oldSnap, newSnap) {
  const fieldsChanged = [];
  if (oldSnap.title !== newSnap.title) fieldsChanged.push('title');
  if (oldSnap.price !== newSnap.price) fieldsChanged.push('price');
  if ((oldSnap.tags || []).join(',') !== (newSnap.tags || []).join(',')) fieldsChanged.push('tags');
  return {
    fieldsChanged,
    summary: fieldsChanged.map(f => `${f} changed`).join(', '),
    old: oldSnap,
    new: newSnap
  };
}

/**
 * Parses Etsy listing or shop HTML to extract details.  This is a best-effort
 * parser; it uses simple selectors and may break if Etsy changes its
 * public markup.  The parser never executes arbitrary scripts.
 * @param {string} html
 */
function parseEtsy(html) {
  const result = { title: null, price: null, tags: [], image: null };
  // Title: try to extract from <title> tag
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    let t = titleMatch[1];
    t = t.replace(/\s+\|\s+Etsy.*/, '').trim();
    result.title = t;
  }
  // Price: look for data-buy-box region or meta itemprop price
  const priceMatch = html.match(/"price":"?\$?([0-9.,]+)/);
  if (priceMatch) {
    result.price = priceMatch[1];
  } else {
    // fallback: search for meta property
    const metaPrice = html.match(/meta itemprop="price" content="([0-9.,]+)/);
    if (metaPrice) result.price = metaPrice[1];
  }
  // Image: use og:image meta
  const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
  if (imgMatch) result.image = imgMatch[1];
  // Tags: naive parse for tag links in listing page
  const tagRegex = /data-search-path="\/search\?q=([^"]+)"/g;
  let tag;
  while ((tag = tagRegex.exec(html)) !== null) {
    result.tags.push(decodeURIComponent(tag[1]));
    if (result.tags.length >= 10) break;
  }
  return result;
}

// Normalization logic mirrors client-side
function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.hash = '';
    u.search = '';
    u.protocol = 'https:';
    u.hostname = u.hostname.toLowerCase();
    const hostParts = u.hostname.split('.');
    if (hostParts.length === 3 && hostParts[1] === 'etsy' && hostParts[2] === 'com') {
      const shop = hostParts[0];
      return `https://www.etsy.com/shop/${shop}`;
    }
    return u.toString();
  } catch (err) {
    return url;
  }
}