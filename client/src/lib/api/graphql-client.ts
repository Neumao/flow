import { ApolloClient, InMemoryCache, from, ApolloLink } from "@apollo/client";
import UploadHttpLink from "apollo-upload-client/UploadHttpLink.mjs";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { Observable } from "@apollo/client/utilities";
import { GRAPHQL_URL, TOKEN_STORAGE_KEY } from "../constants";

// Industry standard GraphQL error types
export interface GraphQLErrorLocation {
  line: number;
  column: number;
}

export interface GraphQLFormattedError {
  message: string;
  locations?: GraphQLErrorLocation[];
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
}

// HTTP Link for queries, mutations, and file uploads
const httpLink = new UploadHttpLink({
  uri: GRAPHQL_URL,
  credentials: "include", // Enable sending cookies (refreshToken) with requests
  // Apollo Client automatically handles file uploads when File objects are detected
});

// Authentication Link - Add token to request headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "apollo-require-preflight": "true", // Bypass CSRF protection for multipart requests
    },
  };
});

// Error Link - Handle authentication errors
const errorLink = onError((errorResponse: any) => {
  const { graphQLErrors, networkError } = errorResponse;

  // Check for authentication errors in graphQLErrors
  const checkErrors = (errors: any[]) => {
    if (!errors) return false;
    for (const err of errors) {
      if (
        err.extensions?.code === "UNAUTHENTICATED" ||
        err.message === "Authentication required" ||
        err.message.includes("Authentication")
      ) {
        console.log("🚫 Authentication error detected, clearing auth state...");
        // Clear invalid tokens
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem("user");
        // Dispatch event to clear user state in AuthProvider
        window.dispatchEvent(new CustomEvent("auth-error"));
        // AuthGuard will handle the redirect based on authentication state
        return true; // Found auth error
      }
    }
    return false; // No auth error found
  };

  // Check graphQLErrors
  if (graphQLErrors && checkErrors(graphQLErrors)) {
    return;
  }

  // Check error.errors (alternative structure)
  if (errorResponse.error?.errors && checkErrors(errorResponse.error.errors)) {
    return;
  }

  if (networkError) {
    console.error("🌐 Network error:", networkError);
  }
});

// Response middleware - Check for new token in response headers and handle auth errors
const responseMiddleware = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const subscription = forward(operation).subscribe({
      next: (result) => {
        const context = operation.getContext();
        const responseHeaders = context.response?.headers;

        // Check if backend sent a new access token (after automatic refresh)
        if (responseHeaders) {
          const newToken = responseHeaders.get("x-new-access-token");
          if (newToken) {
            console.log("🔄 Token refreshed by backend, updating localStorage");
            localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
          }
        }

        // Check for authentication errors in GraphQL response data
        if (result.data) {
          // Check if any operation returned status: false with auth-related message
          const checkForAuthError = (data: any): boolean => {
            if (data && typeof data === "object") {
              if (
                data.status === false &&
                (data.message === "Authentication required" ||
                  data.message.includes("Authentication") ||
                  data.message.includes("auth"))
              ) {
                return true;
              }
              // Recursively check nested objects
              for (const key in data) {
                if (checkForAuthError(data[key])) {
                  return true;
                }
              }
            }
            return false;
          };

          if (checkForAuthError(result.data)) {
            console.log(
              "🚫 Authentication error in response data, clearing auth state...",
            );
            // Clear invalid tokens
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            localStorage.removeItem("user");
            // Dispatch event to clear user state in AuthProvider
            window.dispatchEvent(new CustomEvent("auth-error"));
            // AuthGuard will handle the redirect based on authentication state
          }
        }

        observer.next(result);
      },
      error: (error) => {
        observer.error(error);
      },
      complete: () => {
        observer.complete();
      },
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  });
});

// Apollo Client configuration
export const apolloClient = new ApolloClient({
  link: from([errorLink, responseMiddleware, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          users: {
            merge: false,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "ignore",
      fetchPolicy: "cache-and-network",
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

// Utility functions
export const clearApolloCache = () => {
  apolloClient.cache.reset();
};

export const refetchQueries = (queryNames: string[]) => {
  return apolloClient.refetchQueries({
    include: queryNames,
  });
};

export default apolloClient;
