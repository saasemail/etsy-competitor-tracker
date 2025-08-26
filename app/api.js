// app/api.js
// Simple wrappers around the serverless API endpoints.

import { getSessionId } from './state.js';

async function request(path, options = {}) {
  const headers = options.headers || {};
  headers['Content-Type'] = 'application/json';
  headers['X-Session-Id'] = getSessionId();
  const response = await fetch(path, { ...options, headers });
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }
  return response.json();
}

export async function addTarget(url) {
  return request('/api/targets/add', { method: 'POST', body: JSON.stringify({ url }) });
}

export async function refreshTarget(id) {
  return request(`/api/targets/refresh/${encodeURIComponent(id)}`, { method: 'POST' });
}

export async function getTargets() {
  return request('/api/targets/list');
}

export async function getHistory(id) {
  return request(`/api/targets/${encodeURIComponent(id)}/history`);
}