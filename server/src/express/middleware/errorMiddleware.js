import { logger } from '../../config/logger.js';
import { AppError } from '../../utils/errors.js';

/**
 * Central error handler for Express
 * Logs errors and sends appropriate responses based on error type
 */
export const errorMiddleware = (err, req, res, next) => {
    // Log the error
    logger.error(`${err.name}: ${err.message}`);

    // Always send a simple error response
    res.status(500).json({
        error: {
            message: err.message || 'Internal Server Error'
        }
    });
};

/**
 * Helper function to provide friendly messages for Prisma errors
 */
