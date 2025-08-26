// app/config.js
// Environment-driven configuration values for Free vs Pro limits.
export const CONFIG = {
  FREE_LIMIT_TARGETS: 1,
  FREE_REFRESH_INTERVAL_HOURS: 72,
  PRO_LIMIT_TARGETS: 10,
  PRO_REFRESH_INTERVAL_HOURS: 12,
  ENABLE_EMAIL_ALERTS: false,
  ENABLE_PAYWALL_UI: false,
  ENABLE_CREDITS: false
};

/**
 * Check the query string to see if the user is in demo Pro mode.
 * In production this will be replaced by a real user object.
 */
export function isProUser() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('pro') === '1') return true;
  // Could also look in localStorage or cookie in a future version.
  return false;
}

export function getLimits() {
  if (isProUser()) {
    return {
      targets: CONFIG.PRO_LIMIT_TARGETS,
      refreshInterval: CONFIG.PRO_REFRESH_INTERVAL_HOURS
    };
  }
  return {
    targets: CONFIG.FREE_LIMIT_TARGETS,
    refreshInterval: CONFIG.FREE_REFRESH_INTERVAL_HOURS
  };
}