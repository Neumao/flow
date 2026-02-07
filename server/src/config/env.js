/**
 * Environment configuration
 * Centralizes all environment variable access and provides defaults
 */
import dotenv from 'dotenv';
import TimeUtils from '../utils/timeUtils.js';

// Load environment variables from .env file
dotenv.config();

const config = {
    // Server configuration
    port: process.env.PORT || 4000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key-should-be-in-env',
        accessExpiration: TimeUtils.parseTimeString(process.env.JWT_ACCESS_EXPIRATION, 3600), // Default to 1 hour
        refreshExpiration: TimeUtils.parseTimeString(process.env.JWT_REFRESH_EXPIRATION, 86400), // Default to 1 day
    },

    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        fileMaxSize: process.env.LOG_FILE_MAX_SIZE || '10m',
        maxFiles: process.env.LOG_MAX_FILES || '7d',
    },

    // Rate limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15', 10) * 60 * 1000, // default 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // default 100 requests per windowMs
    },

    // System User
    systemUser: {
        email: process.env.SYSTEM_ADMIN_EMAIL,
        password: process.env.SYSTEM_ADMIN_PASSWORD,
        userName: process.env.SYSTEM_ADMIN_USERNAME
    }
};

export default config;