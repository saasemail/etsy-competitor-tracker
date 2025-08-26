// app/validators.js
// Helpers to validate and normalize Etsy URLs.

/**
 * Determine if the provided string looks like a valid Etsy listing or shop URL.
 * Accepts forms like:
 *  - https://www.etsy.com/listing/123456789/product-name
 *  - https://www.etsy.com/shop/ShopName
 *  - https://shopname.etsy.com
 * @param {string} url
 */
export function isValidEtsyUrl(url) {
  try {
    const u = new URL(url);
    // Only allow Etsy domains
    if (!/etsy\.com$/i.test(u.hostname)) return false;
    // Listing path or shop path
    if (/\/listing\//.test(u.pathname) || /\/shop\//.test(u.pathname)) return true;
    // subdomain like shopname.etsy.com
    const parts = u.hostname.split('.');
    if (parts.length === 3 && parts[1] === 'etsy' && parts[2] === 'com') {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

/**
 * Normalize the Etsy URL into a canonical form.  Strips query parameters and
 * fragments; ensures https scheme and lowercase host.
 * For subdomain shops, returns https://www.etsy.com/shop/<shop>.
 * @param {string} url
 */
export function normalizeUrl(url) {
  const u = new URL(url);
  u.hash = '';
  u.search = '';
  u.protocol = 'https:';
  u.hostname = u.hostname.toLowerCase();
  // Convert shop subdomain to /shop/ path
  const hostParts = u.hostname.split('.');
  if (hostParts.length === 3 && hostParts[1] === 'etsy' && hostParts[2] === 'com') {
    const shop = hostParts[0];
    return `https://www.etsy.com/shop/${shop}`;
  }
  return u.toString();
}