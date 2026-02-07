import { prisma } from '../../../lib/prisma.js';
import { logger } from '../../../config/index.js';
import { apiResponse } from '../../../utils/response.js';

/**
 * User Domain - Query Resolvers
 * Contains all user-related queries: me, user, users
 */
export const userQueries = {
    // Get authenticated user's profile
    me: async (_, __, { user }) => {
        logger.debug(`GraphQL me query executed for user: ${user.id}`);
        const userData = await prisma.user.findUnique({
            where: { id: user.id }
        });
        return apiResponse.success("Fetch successful", userData);
    },

    // Get user by ID
    user: async (_, { id }, { user }) => {
        // Only allow admins or the user themselves to fetch user details
        if (user.id !== id && user.role !== 'ADMIN') {
            return apiResponse.error('You are not authorized to view this user');
        }
        logger.debug(`GraphQL user query executed for user: ${id}`);
        const userData = await prisma.user.findUnique({
            where: { id }
        });
        if (!userData) {
            return apiResponse.error('User not found');
        }
        return apiResponse.success("User Data Fetch successful", userData);
    },

    // Get all users (admin only)
    users: async (_, __, { user }) => {
        if (user.role !== 'ADMIN') {
            return apiResponse.error('You are not authorized to view all users');
        }
        logger.debug('GraphQL users query executed');
        const users = await prisma.user.findMany();
        return apiResponse.success("Users Data Fetch successful", users);
    }
};