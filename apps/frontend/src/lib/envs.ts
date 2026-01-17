export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
export const APP_URL = import.meta.env.VITE_URL ?? 'http://localhost:5173';

export const ALGOLIA_APP_ID = import.meta.env.VITE_ALGOLIA_APP_ID || '';
export const ALGOLIA_API_KEY = import.meta.env.VITE_ALGOLIA_API_KEY || '';
export const ALGOLIA_INDEX_NAME = import.meta.env.VITE_ALGOLIA_INDEX_NAME || '';

export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';
export const SENTRY_ENVIRONMENT = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development';
