import React, { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { httpClient } from '../lib/api/http-client';
import { apolloClient } from '../lib/api/graphql-client';
import { HttpClientContext } from '../hooks/useHttpClient';

// API Provider - Combines HTTP and GraphQL clients
interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const value = {
    httpClient,
  };

  return (
    <ApolloProvider client={apolloClient}>
      <HttpClientContext.Provider value={value}>
        {children}
      </HttpClientContext.Provider>
    </ApolloProvider>
  );
};

export default ApiProvider;
