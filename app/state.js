// app/state.js
// Handles anonymous session management and simple client-side state.

const SESSION_KEY = 'etsy-tracker-session-id';

/**
 * Generates a random ID.
 */
function generateId() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export function ensureSession() {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = generateId();
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function getSessionId() {
  return localStorage.getItem(SESSION_KEY);
}

// Placeholder for client-side user state (targets count, credits, etc.)
export const userState = {
  targetsCount: 0,
  credits: 0
};