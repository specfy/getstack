/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string | undefined;
  readonly VITE_URL?: string | undefined;
  readonly VITE_GA_ID?: string | undefined;
  readonly VITE_ALGOLIA_APP_ID?: string | undefined;
  readonly VITE_ALGOLIA_API_KEY?: string | undefined;
  readonly VITE_ALGOLIA_INDEX_NAME?: string | undefined;
  readonly VITE_SENTRY_DSN?: string | undefined;
  readonly VITE_SENTRY_ENVIRONMENT?: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
