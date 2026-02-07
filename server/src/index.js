import http from 'http';
// Make file logger globally available
import { file } from './utils/fileLogger.js';
globalThis.file = file;
// Trigger restart for schema update
import cors from 'cors';
import { expressMiddleware } from '@as-integrations/express5';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { apolloServer, createContext, schema } from './graphql/server.js';
import { extractTokenFromHeader } from './utils/jwtUtils.js';
import { authenticateUser } from './utils/authUtils.js';
import expressApp from './express/server.js';
import { logger, config } from './config/index.js';
// import prisma from '../prisma/client.js';
import { prisma } from './lib/prisma.js'
import path from 'path';
import fs from 'fs';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

import appSeeding from './seeding/appSeeding.js';

process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason) => {
    logger.error('UNHANDLED REJECTION:', reason);
});

// Create logs directory if it doesn't exist
try {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
        logger.info(`Created logs directory: ${logDir}`);
    }
} catch (fsError) {
    logger.error('Error creating logs directory:', fsError);
}

async function startServer() {
    try {
        logger.info('Starting Apollo Server v5 with native subscriptions...');

        // Create HTTP server
        const httpServer = http.createServer(expressApp);

        // Create WebSocket server for subscriptions (schema is already created in server.js)
        const wsServer = new WebSocketServer({
            server: httpServer,
            path: '/graphql',
        });

        //**************WEBSOCKETS**********************//
        // WEBSOCKET CONTEXT HANDLING FOR AUTHENTICATION
        // Hand in the schema and have the WebSocketServer start listening
        // *******************************************//
        const serverCleanup = useServer({
            schema,
            context: async (ctx, msg, args) => {
                // Extract authentication tokens from connection params
                const connectionParams = ctx.connectionParams || {};
                const authorization = connectionParams.authorization || connectionParams.Authorization;
                const refreshToken = connectionParams.refreshToken || connectionParams.refresh_token;

                const accessToken = extractTokenFromHeader(authorization);

                const result = await authenticateUser({ accessToken, refreshToken, isWebSocket: true });

                return {
                    user: result.user,
                    authenticated: !!result.user,
                    newAccessToken: result.newAccessToken,
                    newRefreshToken: result.newRefreshToken,
                    tokenRefreshed: !!result.newAccessToken,
                    prisma
                };
            },
            onConnect: async (ctx) => {
                logger.info('🔌 WebSocket client connected for subscriptions');
                return true; // Allow connection (authentication handled in context)
            },
            onDisconnect: (ctx, code, reason) => {
                logger.info('🔌 WebSocket client disconnected', { code, reason });
            },
            onSubscribe: (ctx, message) => {
                logger.info('📡 New subscription started:', {
                    operationName: message.payload?.operationName || 'unnamed',
                    query: message.payload?.query?.substring(0, 100) + '...'
                });
            },
            onNext: (ctx, message, args, result) => {
                logger.info('📤 Sending subscription data to client');
            },
            onError: (ctx, message, errors) => {
                logger.error('❌ Subscription error:', errors);
            },
            onComplete: (ctx, message) => {
                logger.info('✅ Subscription completed');
            }
        }, wsServer);

        // Start Apollo Server (plugins are configured in server.js)
        await apolloServer.start();
        logger.info('Apollo Server v5 started successfully');

        // Apply Apollo middleware to Express with context function
        expressApp.use(
            '/graphql',
            cors({
                origin: 'http://localhost:5173', // Frontend origin
                credentials: true, // Allow cookies
                exposedHeaders: ['x-new-access-token'], // Expose custom header for token refresh
            }),
            graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }), // Add file upload middleware
            expressMiddleware(apolloServer, {
                context: createContext
            })
        );

        const PORT = config.port;

        httpServer.listen(PORT, () => {
            logger.info(`🚀 Apollo Server v5 running in ${config.nodeEnv} mode`);
            logger.info(`📡 Express REST API: http://localhost:${PORT}/api`);
            logger.info(`🎯 Apollo GraphQL: http://localhost:${PORT}/graphql`);
            logger.info(`🔌 WebSocket Subscriptions: ws://localhost:${PORT}/graphql`);
        });

        // Handle server shutdown
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

        async function gracefulShutdown() {
            logger.info('Shutting down Apollo Server v5...');
            await serverCleanup.dispose();
            httpServer.close(() => {
                logger.info('HTTP server shut down successfully');
                apolloServer.stop().then(() => {
                    logger.info('Apollo Server stopped');
                    setTimeout(() => {
                        process.exit(0);
                    }, 500); // 500ms delay to allow OS to release port
                });
            });
        }
    } catch (error) {
        logger.error(`Failed to start Apollo Server v5: ${error.message}`);
        process.exit(1);
    }
}

await startServer()
    .then(async () => {
        logger.info('Server started successfully');
        await appSeeding.systemUser(); // Corrected to call the static method directly

    })
    .catch(error => {
        logger.error('Failed to start server:', error);
        process.exit(1);
    });