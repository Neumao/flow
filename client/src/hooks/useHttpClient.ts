import { useContext } from "react";
import { createContext } from "react";
import type { httpClient } from "../lib/api/http-client";

// HTTP Client Context Type
interface HttpClientContextType {
  httpClient: typeof httpClient;
}

// HTTP Client Context
export const HttpClientContext = createContext<
  HttpClientContextType | undefined
>(undefined);

// Custom hook to use HTTP client
export const useHttpClient = (): HttpClientContextType => {
  const context = useContext(HttpClientContext);
  if (context === undefined) {
    throw new Error("useHttpClient must be used within a HttpClientProvider");
  }
  return context;
};
