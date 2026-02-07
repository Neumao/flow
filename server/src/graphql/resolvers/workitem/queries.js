// WorkItem query resolvers
// WorkItem query resolvers
import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../utils/response.js';
import { logger } from '../../../config/logger.js';

/**
 * WorkItem Domain - Query Resolvers
 * Contains all work item-related queries: workItems, workItem
 */
export const workItemQueries = {
    // Get all accessible work items for the user (role-based)
    workItems: async (_, __, { user }) => {
        try {
            if (!user) return [];
            // SYSADMIN/ADMIN/MODERATOR: all, USER: own only
            let where = {};
            if (user.role === 'USER') {
                where = { createdBy: user.id };
            }
            logger.debug(`Fetching work items for user: ${user?.id}, role: ${user?.role}`);
            const items = await prisma.workItem.findMany({ where });
            logger.info(`Fetched ${items.length} work items for user: ${user?.id}`);
            return items || [];
        } catch (err) {
            logger.error('Error fetching work items:', err);
            return [];
        }
    },

    // Get a single work item by ID (role-based)
    workItem: async (_, { id }, { user }) => {
        if (!user) return apiResponse.error('Authentication required');
        logger.debug(`Fetching work item ${id} for user: ${user.id}`);
        const item = await prisma.workItem.findUnique({ where: { id } });
        if (!item) {
            logger.warn(`Work item not found: ${id}`);
            return apiResponse.error('Work item not found');
        }
        if (user.role === 'USER' && item.createdBy !== user.id) {
            logger.warn(`User ${user.id} not authorized to view work item ${id}`);
            return apiResponse.error('Not authorized to view this work item');
        }
        logger.info(`Fetched work item ${id} for user: ${user.id}`);
        return apiResponse.success('Work item fetched', item);
    },
};
