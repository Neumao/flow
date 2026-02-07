/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GRAPHQL_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_JWT_SECRET: string;
  readonly VITE_DEBUG: string;
  readonly VITE_LOG_LEVEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
