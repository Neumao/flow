import { verifyToken, generateAccessToken, generateRefreshToken } from '../utils/jwtUtils.js';
import { prisma } from '../lib/prisma.js';
import config from '../config/env.js';
import { logger } from '../config/index.js';
import { UnauthorizedError } from './errors.js';

/**
 * Shared authentication logic for both HTTP and WebSocket contexts
 * @param {Object} params - Authentication parameters
 * @param {string} params.accessToken - Access token
 * @param {string} params.refreshToken - Refresh token
 * @param {boolean} params.isWebSocket - Whether this is for WebSocket context
 * @param {Object} params.res - Response object (for HTTP only)
 * @returns {Object} - Authentication result
 */
export const authenticateUser = async ({ accessToken, refreshToken, isWebSocket = false, res = null }) => {
    try {
        if (!accessToken) {
            // No token provided - allow unauthenticated access
            return { user: null };
        }

        try {
            // Verify access token
            const user = verifyToken(accessToken);
            logger.debug(`Token verified for user: ${user.id}`);
            return { user };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                logger.warn('Access token expired, attempting to refresh');

                if (!refreshToken) {
                    logger.warn('No refresh token provided');
                    throw new UnauthorizedError('Authentication token expired and no refresh token available');
                }

                try {
                    // Verify refresh token
                    const decoded = verifyToken(refreshToken);
                    const user = await prisma.user.findUnique({
                        where: { id: decoded.id }
                    });

                    if (!user) {
                        logger.warn('User not found for refresh token');
                        if (!isWebSocket && res) {
                            res.clearCookie('refreshToken');
                        }
                        throw new UnauthorizedError('Invalid refresh token - user not found');
                    }
                    // Check token version for invalidation
                    if (decoded.tokenVersion !== user.tokenVersion) {
                        logger.warn('Token version mismatch');
                        if (!isWebSocket && res) {
                            res.clearCookie('refreshToken');
                        }
                        throw new UnauthorizedError('Token has been invalidated');
                    }

                    // Generate new tokens
                    const newAccessToken = generateAccessToken(user);
                    const newRefreshToken = generateRefreshToken(user);
                    const expirationTime = config.jwt.accessExpiration || 3600;

                    if (isNaN(expirationTime) || expirationTime <= 0) {
                        logger.error(`Invalid JWT access expiration time: ${config.jwt.accessExpiration}`);
                        throw new Error('Invalid JWT access expiration time');
                    }

                    // Update database
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            authToken: newAccessToken,
                            authTokenExpiry: new Date(Date.now() + expirationTime * 1000).toISOString(),
                        },
                    });

                    if (!isWebSocket && res) {
                        // Set new refresh token in cookies (HTTP)
                        res.cookie('refreshToken', newRefreshToken, {
                            httpOnly: true,
                            secure: config.nodeEnv === 'production',
                            sameSite: 'strict',
                            maxAge: config.jwt.refreshExpiration * 1000,
                        });

                        // Send new access token in response header
                        res.setHeader('x-new-access-token', newAccessToken);
                    }

                    logger.info(`Refreshed tokens for user: ${user.id}`);
                    return { user, newAccessToken, newRefreshToken };
                } catch (refreshError) {
                    logger.error(`Invalid refresh token: ${refreshError.message}`);
                    if (!isWebSocket && res) {
                        res.clearCookie('refreshToken');
                    }
                    throw new UnauthorizedError('Invalid refresh token');
                }
            }

            logger.warn(`Invalid token: ${error.message}`);
            throw new UnauthorizedError('Invalid authentication token');
        }
    } catch (error) {
        logger.error(`Authentication error: ${error.message}`);
        throw new UnauthorizedError('Authentication error');
    }
};