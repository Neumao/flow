import { logger } from '../../../config/index.js';
import { apiResponse } from '../../../utils/response.js';

/**
 * Base Domain - Query Resolvers
 * Contains common/shared queries like hello, health checks, etc.
 */
export const baseQueries = {
    // Hello world query for testing
    hello: () => {
        logger.debug('GraphQL hello query executed');
        return apiResponse.success('Hello from Apollo Server!', null);
    },

    // Base placeholder queries
    _: () => true,
};