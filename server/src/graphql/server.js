import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { logger } from '../config/index.js';
import typeDefs from './schema/index.js';
import resolvers from './resolvers/index.js';
import { createContext } from './context.js';
import { AppError } from '../utils/errors.js';

export const serverStatus = {
    initialized: false,
    startError: null
};

// Create executable schema for both HTTP and WebSocket
const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({
    schema, // Use schema instead of typeDefs + resolvers for v5 subscriptions
    introspection: process.env.NODE_ENV !== 'production',
    formatError: (formattedError, error) => {
        const errorLevel = error instanceof AppError && error.statusCode < 500 ? 'warn' : 'error';

        // Handle wrapped errors (e.g., context creation failures)
        let actualError = error;
        if (error.cause instanceof AppError) {
            actualError = error.cause;
        } else if (error.originalError instanceof AppError) {
            actualError = error.originalError;
        }

        if (actualError instanceof AppError) {
            const level = actualError.statusCode < 500 ? 'warn' : 'error';
            logger[level](`GraphQL Error: ${actualError.message}`, {
                path: formattedError.path?.join('.') || 'unknown',
                code: 'MAPPED_FROM_STATUS',
                operation: formattedError.extensions?.operationName || 'unknown',
                originalError: actualError
            });
        } else {
            logger[errorLevel](`GraphQL Error: ${formattedError.message}`, {
                path: formattedError.path?.join('.') || 'unknown',
                code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
                operation: formattedError.extensions?.operationName || 'unknown',
                originalError: error
            });
        }

        if (process.env.NODE_ENV === 'production') {
            let code = 'INTERNAL_SERVER_ERROR';
            if (actualError instanceof AppError) {
                if (actualError.statusCode === 400) code = 'BAD_USER_INPUT';
                else if (actualError.statusCode === 401) code = 'UNAUTHENTICATED';
                else if (actualError.statusCode === 403) code = 'FORBIDDEN';
                else if (actualError.statusCode === 404) code = 'NOT_FOUND';
                else if (actualError.statusCode === 409) code = 'CONFLICT';
                else if (actualError.statusCode === 429) code = 'RATE_LIMITED';
            }
            return {
                message: actualError instanceof AppError ? actualError.message : formattedError.message,
                path: formattedError.path,
                extensions: {
                    code
                }
            };
        }

        // Development: Include full details
        let code = 'INTERNAL_SERVER_ERROR';
        if (actualError instanceof AppError) {
            if (actualError.statusCode === 400) code = 'BAD_USER_INPUT';
            else if (actualError.statusCode === 401) code = 'UNAUTHENTICATED';
            else if (actualError.statusCode === 403) code = 'FORBIDDEN';
            else if (actualError.statusCode === 404) code = 'NOT_FOUND';
            else if (actualError.statusCode === 409) code = 'CONFLICT';
            else if (actualError.statusCode === 429) code = 'RATE_LIMITED';
        }
        return {
            ...formattedError,
            message: actualError instanceof AppError ? actualError.message : formattedError.message,
            extensions: {
                ...formattedError.extensions,
                code
            }
        };
    },
    plugins: [
        {
            async requestDidStart(requestContext) {
                const { request } = requestContext;
                const operationName = request.operationName || 'unnamed operation';
                if (operationName !== 'IntrospectionQuery') {
                    logger.http(`GraphQL request started: ${operationName} (${request.query?.replace(/\s+/g, ' ').substring(0, 100)}...)`);
                }
                return {
                    async didEncounterErrors(ctx) {
                        const { errors } = ctx;
                        if (errors && errors.length > 0) {
                            logger.warn(`GraphQL encountered ${errors.length} errors during execution`, {
                                operation: operationName,
                            });
                        }
                    },
                    async willSendResponse(responseContext) {
                        const { response } = responseContext;
                        const hasErrors = response.body.kind === 'single' &&
                            response.body.singleResult.errors &&
                            response.body.singleResult.errors.length > 0;
                        if (hasErrors) {
                            logger.warn(`GraphQL response with errors: ${operationName}`);
                        } else {
                            if (operationName !== 'IntrospectionQuery') {
                                logger.http(`GraphQL request completed: ${operationName}`);
                            }
                        }
                    }
                };
            }
        }
    ],
});

export { apolloServer, createContext, schema };