import { config, logger } from "../config/index.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

class appSeeding {
    static async allUsers() {
        const usersToBeSeeded = [
            {
                email: "admin@mail.com",
                password: "123",
                userName: "Admin",
                role: "ADMIN",
            },
            {
                email: "moderator@mail.com",
                password: "123",
                userName: "Moderator",
                role: "MODERATOR",
            },
            {
                email: "user@mail.com",
                password: "123",
                userName: "User",
                role: "USER",
            },
        ]
        for (const userData of usersToBeSeeded) {
            try {
                const userExist = await prisma.user.findUnique({ where: { email: userData.email } });
                if (!userExist) {
                    const saltRounds = 10;
                    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
                    await prisma.user.create({
                        data: {
                            email: userData.email,
                            password: hashedPassword,
                            userName: userData.userName,
                            role: userData.role,
                            isVerified: true,
                        }
                    })
                    logger.info(`User with role ${userData.role} created`);
                }
            } catch (error) {
                console.log(error);
                logger.error(`Failed to create user with role ${userData.role}`, {
                    error: error.message,
                });
                throw error;
            }
        }
    }
    static async systemUser() {
        try {
            const adminExist = await prisma.user.findUnique({
                where: {
                    email: config.systemUser.email,
                }
            })
            if (!adminExist) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(config.systemUser.password, saltRounds);
                await prisma.user.create({
                    data: {
                        email: config.systemUser.email,
                        password: hashedPassword,
                        userName: config.systemUser.userName,
                        role: "SYSADMIN",
                        isVerified: true,
                    }
                })
                logger.info('System admin user created');

            }
            else {
                logger.info('System admin user already exists');
            }
        } catch (error) {
            console.log(error);
            logger.error('Failed to create system user', {
                error: error.message,
            });
            throw error;
        }
    }
}

export default appSeeding;