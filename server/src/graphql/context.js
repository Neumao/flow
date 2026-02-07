import { extractTokenFromHeader, generateAccessToken, generateRefreshToken } from '../utils/jwtUtils.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../config/index.js';
import { authenticateUser } from '../utils/authUtils.js';

export const createContext = async ({ req, res }) => {
    try {
        // Allow introspection and public operations without authentication
        const operationName = req.body?.operationName;
        if (
            operationName === 'IntrospectionQuery' ||
            operationName === 'login' ||
            operationName === 'register'
        ) {
            return { user: null, res, prisma };
        }

        // Get token from authorization header
        const authHeader = req?.headers?.authorization;
        const accessToken = extractTokenFromHeader(authHeader);
        // Get refresh token from cookies
        const refreshToken = req.cookies?.refreshToken;

        const result = await authenticateUser({ accessToken, refreshToken, res });
        return { user: result.user, res, prisma };
    } catch (error) {
        // Let GraphQLError bubble up to fail the request
        throw error;
    }
};

/**
 * Create subscription context
 * Handles user authentication for WebSocket connections
 * @param {Object} options - Context function options
 * @returns {Object} - Context object
 */
export const createSubscriptionContext = async ({ _token, refreshToken }) => {
    try {
        const token = extractTokenFromHeader(_token)
        if (!token && !refreshToken) {
            throw new Error('Authentication token is required');
        }

        try {
            const user = verifyToken(token);
            logger.debug(`WebSocket connection authenticated for user: ${user.id}`);
            return { user, prisma };
        } catch (error) {
            if (error.name === 'TokenExpiredError' && refreshToken) {
                logger.warn('Access token expired, attempting to refresh');

                try {
                    const user = verifyToken(refreshToken, true); // Verify refresh token
                    const newAccessToken = generateAccessToken(user);
                    const newRefreshToken = generateRefreshToken(user);

                    logger.info(`Refreshed tokens for user: ${user.id}`);
                    return { user, newAccessToken, newRefreshToken, prisma };
                } catch (refreshError) {
                    logger.error(`Invalid refresh token: ${refreshError.message}`);
                    return { user: null, prisma };
                }
            }
            logger.error(`WebSocket connection error: ${error.message}`);
            return { user: null, prisma };
        }
    } catch (error) {
        logger.error(`Error in subscription context: ${error.message}`);
        return { user: null, prisma };
    }
};