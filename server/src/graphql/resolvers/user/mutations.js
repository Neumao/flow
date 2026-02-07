import bcrypt from 'bcrypt';
import { logger } from '../../../config/logger.js';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwtUtils.js';
import { apiResponse } from '../../../utils/response.js';
import { prisma } from '../../../lib/prisma.js';
import config from '../../../config/env.js';

/**
 * User Domain - Mutation Resolvers
 * Contains all user-related mutations: register, login, logout, updateUser, deleteUser
 */
export const userMutations = {
    /**
     * Register a new user
     */
    register: async (_, { input }) => {
        const { email, password, firstName, lastName, userName, role } = input;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            logger.warn(`Registration attempt with existing email: ${email}`);
            return apiResponse.error('User with this email already exists');
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    userName,
                    firstName,
                    lastName,
                    role,
                },
            });

            logger.info(`User created via GraphQL: ${user.id}`);
            return apiResponse.success('User registered successfully', user);
        } catch (error) {
            logger.error(`Error creating user via GraphQL: ${error.message}`);
            return apiResponse.error('An error occurred while registering user');
        }
    },

    /**
     * Login user
     */
    login: async (_, { input }, { res }) => {
        const { email, password } = input;
        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            logger.warn(`Login attempt with non-existent email: ${email}`);
            return apiResponse.error('Invalid email or password');
        }

        // Verify password
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            logger.warn(`Failed login attempt for user: ${user.id}`);
            return apiResponse.error('Invalid email or password');
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Update refresh token in database
        const expirationTime = config.jwt.accessExpiration || 3600; // Default to 1 hour if undefined
        if (isNaN(expirationTime) || expirationTime <= 0) {
            logger.error(`Invalid JWT access expiration time: ${config.jwt.accessExpiration}`);
            throw new Error('Invalid JWT access expiration time');
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                authToken: accessToken,
                authTokenExpiry: new Date(Date.now() + expirationTime * 1000).toISOString(),
                lastLoginAt: new Date(),
            },
        });

        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: config.jwt.refreshExpiration * 1000,
        });

        logger.info(`User logged in via GraphQL: ${user.id}`);

        // Return user data with access token
        const userWithToken = {
            ...user,
            authToken: accessToken,
        };

        return apiResponse.success('Login successful', userWithToken);
    },

    /**
     * Logout user
     */
    logout: async (_, __, { user, res }) => {

        await prisma.user.update({
            where: { id: user.id },
            data: {
                authToken: null,
                authTokenExpiry: null,
            },
        });

        // Clear refresh token from cookies
        res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            sameSite: 'strict',
            maxAge: 0, // Clear the cookie immediately
        });

        logger.info(`User logged out via GraphQL: ${user.id}`);

        return apiResponse.success(null);
    },

    /**
     * Update user profile
     */
    updateUser: async (_, { input }, { user }) => {
        // Id not provided
        const { id } = input;
        if (id === undefined || id === null || id.trim() === '') {
            return apiResponse.error('User ID is required');
        }

        // Only allow users to update their own profile or admins to update any profile
        // Only SYSADMIN and ADMIN can update other user profiles
        if (user.id !== id && user.role !== 'ADMIN' && user.role !== 'SYSADMIN') {
            return apiResponse.error('Not authorized to update this profile');
        }

        const { email, ...otherData } = input;
        const updatePayload = { ...otherData };

        // If changing email, check if new email already exists
        if (email) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser && existingUser.id !== id) {
                return apiResponse.error('User with this email already exists');
            }

            updatePayload.email = email;
        }

        // Update user
        try {
            const updatedUser = await prisma.user.update({
                where: { id },
                data: updatePayload,
            });

            logger.info(`User updated via GraphQL: ${updatedUser.id}`);

            return apiResponse.success('User updated successfully', updatedUser);
        } catch (error) {
            logger.error(`Error updating user via GraphQL: ${error.message}`);
            return apiResponse.error('An error occurred while updating user');
        }
    },

    /**
     * Delete user
     */
    deleteUser: async (_, { id }, { user }) => {

        // Only SYSADMIN and ADMIN can delete users
        if (user.role !== 'ADMIN' && user.role !== 'SYSADMIN') {
            return apiResponse.error('Not authorized to delete users');
        }

        // Prevent users from deleting themselves
        if (user.id === id) {
            return apiResponse.error('Cannot delete your own account');
        }

        try {
            const deletedUser = await prisma.user.delete({
                where: { id },
            });

            logger.info(`User deleted via GraphQL: ${deletedUser.id}`);

            return apiResponse.success('User deleted successfully', deletedUser);
        } catch (error) {
            logger.error(`Error deleting user via GraphQL: ${error.message}`);
            return apiResponse.error('An error occurred while deleting user');
        }
    },
};