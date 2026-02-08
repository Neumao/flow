// WorkItem mutation resolvers
// WorkItem mutation resolvers
import { prisma } from '../../../lib/prisma.js';
import { apiResponse } from '../../../utils/response.js';
import { logger } from '../../../config/logger.js';

/**
 * WorkItem Domain - Mutation Resolvers
 * Contains all work item-related mutations
 */
export const workItemMutations = {
    // Create a new work item
    createWorkItem: async (_, { input }, { user }) => {
        if (!user) throw new Error('Authentication required');
        const { title, description } = input;
        logger.debug(`Creating work item for user: ${user.id}`);
        const item = await prisma.workItem.create({
            data: {
                title,
                description,
                state: 'NEW',
                blocked: false,
                reworkRequired: false,
                createdById: user.id,
            },
            include: { createdBy: true },
        });
        logger.info(`Work item created: ${item.id} by user: ${user.id}`);

        // Create audit event for creation
        await prisma.workItemAuditEvent.create({
            data: {
                workItemId: item.id,
                userId: user.id,
                eventType: 'STATE_CHANGE',
                fromState: null,
                toState: 'NEW',
                justification: 'Work item created',
            },
        });

        return apiResponse.success('Work item created', item);
    },

    // Update work item (only creator or admin)
    updateWorkItem: async (_, { input }, { user }) => {
        if (!user) return apiResponse.error('Authentication required');
        const { id, title, description } = input;
        logger.debug(`Updating work item ${id} by user: ${user.id}`);
        const item = await prisma.workItem.findUnique({ where: { id } });
        if (!item) {
            logger.warn(`Work item not found: ${id}`);
            return apiResponse.error('Work item not found');
        }
        if (user.role === 'USER' && item.createdById !== user.id) {
            logger.warn(`User ${user.id} not authorized to update work item ${id}`);
            return apiResponse.error('Not authorized to update this work item');
        }
        if (item.state === 'CANCELLED' || item.state === 'DONE') {
            logger.warn(`Cannot update work item ${id} in state ${item.state}`);
            return apiResponse.error('Cannot update a cancelled or completed work item');
        }
        const updated = await prisma.workItem.update({
            where: { id },
            data: { title, description },
        });
        logger.info(`Work item updated: ${id} by user: ${user.id}`);

        // Create audit event for update
        await prisma.workItemAuditEvent.create({
            data: {
                workItemId: id,
                userId: user.id,
                eventType: 'STATE_CHANGE',
                fromState: item.state,
                toState: item.state, // State doesn't change on update
                justification: 'Work item updated',
            },
        });

        return apiResponse.success('Work item updated', updated);
    },

    // Transition work item state (enforce allowed transitions)
    transitionWorkItem: async (_, { input }, { user }) => {
        if (!user) return apiResponse.error('Authentication required');
        const { id, toState, justification } = input;
        const item = await prisma.workItem.findUnique({ where: { id } });
        if (!item) return apiResponse.error('Work item not found');

        // Blocked items cannot progress except unblock
        if (item.blocked) {
            return apiResponse.error('Blocked items cannot transition');
        }
        if (item.state === 'CANCELLED' || item.state === 'DONE') {
            return apiResponse.error('Cannot transition a cancelled or completed work item');
        }

        // Only allow valid transitions (requirements-plan.md)
        const allowed = {
            NEW: ['IN_PROGRESS', 'CANCELLED'],
            IN_PROGRESS: ['REVIEW', 'CANCELLED'],
            REVIEW: ['DONE', 'REWORK', 'BLOCKED', 'CANCELLED'],
            REWORK: ['IN_PROGRESS', 'CANCELLED'],
            BLOCKED: ['IN_PROGRESS'],
        };
        const valid = allowed[item.state] && allowed[item.state].includes(toState);
        if (!valid && toState !== 'CANCELLED') {
            return apiResponse.error('Invalid state transition');
        }

        // Role-based permission: only MODERATOR/ADMIN/SYSADMIN can move out of REVIEW, block, or rework
        if (
            (item.state === 'REVIEW' && ['DONE', 'REWORK', 'BLOCKED'].includes(toState)) &&
            !['MODERATOR', 'ADMIN', 'SYSADMIN'].includes(user.role)
        ) {
            return apiResponse.error('Not authorized for this transition');
        }

        // USER can only transition their own items
        if (user.role === 'USER' && item.createdById !== user.id) {
            return apiResponse.error('Not authorized to transition this work item');
        }

        // Justification required for REWORK, BLOCKED, CANCELLED
        if ((toState === 'REWORK' || toState === 'BLOCKED' || toState === 'CANCELLED') && !justification) {
            return apiResponse.error('Justification required for this transition');
        }

        // Update state
        const updated = await prisma.workItem.update({
            where: { id },
            data: {
                state: toState,
                reworkRequired: toState === 'REWORK',
                blocked: toState === 'BLOCKED',
                blockReason: toState === 'BLOCKED' ? justification : null,
            },
        });

        // Audit event
        await prisma.workItemAuditEvent.create({
            data: {
                workItemId: id,
                userId: user.id,
                eventType: toState === 'BLOCKED' ? 'BLOCKED' : toState === 'REWORK' ? 'REWORK' : toState === 'CANCELLED' ? 'CANCELLED' : 'STATE_CHANGE',
                fromState: item.state,
                toState,
                justification: justification || null,
            },
        });

        return apiResponse.success('Work item state transitioned', updated);
    },

    // Block a work item
    blockWorkItem: async (_, { id, reason }, { user }) => {
        if (!user) return apiResponse.error('Authentication required');
        const item = await prisma.workItem.findUnique({ where: { id } });
        if (!item) return apiResponse.error('Work item not found');
        if (item.blocked) return apiResponse.error('Work item is already blocked');
        if (item.state === 'CANCELLED' || item.state === 'DONE') return apiResponse.error('Cannot block a cancelled or completed work item');
        // Only MODERATOR/ADMIN/SYSADMIN can block
        if (!['MODERATOR', 'ADMIN', 'SYSADMIN'].includes(user.role)) {
            return apiResponse.error('Not authorized to block work items');
        }
        if (!reason) return apiResponse.error('Block reason required');
        const updated = await prisma.workItem.update({
            where: { id },
            data: { state: 'BLOCKED', blocked: true, blockReason: reason },
        });
        await prisma.workItemAuditEvent.create({
            data: {
                workItemId: id,
                userId: user.id,
                eventType: 'BLOCKED',
                fromState: item.state,
                toState: 'BLOCKED',
                justification: reason,
            },
        });
        return apiResponse.success('Work item blocked', updated);
    },

    // Unblock a work item
    unblockWorkItem: async (_, { id }, { user }) => {
        if (!user) return apiResponse.error('Authentication required');
        const item = await prisma.workItem.findUnique({ where: { id } });
        if (!item) return apiResponse.error('Work item not found');
        if (!item.blocked) return apiResponse.error('Work item is not blocked');
        if (item.state === 'CANCELLED' || item.state === 'DONE') return apiResponse.error('Cannot unblock a cancelled or completed work item');
        // Only MODERATOR/ADMIN/SYSADMIN can unblock
        if (!['MODERATOR', 'ADMIN', 'SYSADMIN'].includes(user.role)) {
            return apiResponse.error('Not authorized to unblock work items');
        }
        const updated = await prisma.workItem.update({
            where: { id },
            data: { state: 'IN_PROGRESS', blocked: false, blockReason: null },
        });
        await prisma.workItemAuditEvent.create({
            data: {
                workItemId: id,
                userId: user.id,
                eventType: 'UNBLOCKED',
                fromState: 'BLOCKED',
                toState: 'IN_PROGRESS',
            },
        });
        return apiResponse.success('Work item unblocked', updated);
    },

    // Rework a work item
    reworkWorkItem: async (_, { id, justification }, { user }) => {
        if (!user) return apiResponse.error('Authentication required');
        const item = await prisma.workItem.findUnique({ where: { id } });
        if (!item) return apiResponse.error('Work item not found');
        if (item.state !== 'REVIEW') return apiResponse.error('Can only rework from REVIEW state');
        // Only MODERATOR/ADMIN/SYSADMIN can rework
        if (!['MODERATOR', 'ADMIN', 'SYSADMIN'].includes(user.role)) {
            return apiResponse.error('Not authorized to rework work items');
        }
        if (!justification) return apiResponse.error('Justification required for rework');
        const updated = await prisma.workItem.update({
            where: { id },
            data: { state: 'REWORK', reworkRequired: true },
        });
        await prisma.workItemAuditEvent.create({
            data: {
                workItemId: id,
                userId: user.id,
                eventType: 'REWORK',
                fromState: 'REVIEW',
                toState: 'REWORK',
                justification,
            },
        });
        return apiResponse.success('Work item sent for rework', updated);
    },

    // Cancel a work item
    cancelWorkItem: async (_, { id, justification }, { user }) => {
        if (!user) return apiResponse.error('Authentication required');
        const item = await prisma.workItem.findUnique({ where: { id } });
        if (!item) return apiResponse.error('Work item not found');
        // Only creator, ADMIN, or SYSADMIN can cancel
        if (user.role === 'USER' && item.createdById !== user.id) {
            return apiResponse.error('Not authorized to cancel this work item');
        }
        if (item.state === 'CANCELLED') {
            return apiResponse.error('Work item is already cancelled');
        }
        if (!justification) return apiResponse.error('Justification required for cancel');
        const updated = await prisma.workItem.update({
            where: { id },
            data: { state: 'CANCELLED' },
        });
        await prisma.workItemAuditEvent.create({
            data: {
                workItemId: id,
                userId: user.id,
                eventType: 'CANCELLED',
                fromState: item.state,
                toState: 'CANCELLED',
                justification,
            },
        });
        return apiResponse.success('Work item cancelled', updated);
    },
};
