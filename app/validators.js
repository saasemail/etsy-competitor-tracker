// app/validators.js
export function isValidEtsyUrl(input) {
  try {
    const u = new URL(input.trim());
    const path = (u.origin + u.pathname).toLowerCase();
    // Samo Etsy listing linkovi su podržani (npr. /listing/123456789)
    return /^https?:\/\/(www\.)?etsy\.com\/listing\/\d+/.test(path);
  } catch {
    return false;
  }
}

export function normalizeEtsyUrl(input) {
  const u = new URL(input.trim());
  // uklanja sve parametre i hash (#) deo
  return `${u.origin}${u.pathname}`;
}
