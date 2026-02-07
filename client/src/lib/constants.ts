/**
 * Application Constants
 * Centralized configuration for environment variables and constants
 */

// API Endpoints
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
export const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000/graphql";
export const WS_URL =
  import.meta.env.VITE_WS_URL || "ws://localhost:4000/graphql";

// Storage Keys
export const TOKEN_STORAGE_KEY =
  import.meta.env.VITE_TOKEN_STORAGE_KEY || "auth_token";
export const USER_STORAGE_KEY = "user";
export const THEME_STORAGE_KEY = "app-theme";
export const MODE_STORAGE_KEY = "app-mode";

// Application Settings
export const APP_NAME = "Flow";
export const APP_VERSION = "1.0.0";

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Date Formats
export const DATE_FORMAT = "YYYY-MM-DD";
export const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const TIME_FORMAT = "HH:mm:ss";

// Feature Flags
export const ENABLE_SUBSCRIPTIONS =
  import.meta.env.VITE_ENABLE_SUBSCRIPTIONS === "true";
export const ENABLE_ANALYTICS =
  import.meta.env.VITE_ENABLE_ANALYTICS === "true";

// Environment
export const IS_PRODUCTION = import.meta.env.PROD;
export const IS_DEVELOPMENT = import.meta.env.DEV;
