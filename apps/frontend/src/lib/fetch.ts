import { API_URL, APP_URL } from './envs';

/**
 * Fetch wrapper for API calls that:
 * - Automatically prepends API_URL to the path
 * - Adds proper headers for SSR requests to prevent 403 errors
 */
export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  // Prepend API_URL if path doesn't start with http
  const url = path.startsWith('http')
    ? path
    : `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  // Detect if we're in SSR (server-side)
  const isSSR = globalThis.window === undefined;

  const headers = new Headers(options.headers);

  // Add Origin header during SSR to prevent 403 from Cloudflare/reverse proxies
  if (isSSR) {
    headers.set('Origin', APP_URL);
    headers.set('User-Agent', 'getstack-ssr/1.0');
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
