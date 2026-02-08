import { injectable } from "tsyringe";
import { AppDataSource } from "../config/database";
import { User, UserStatus } from "../entity/User";
import { logger } from "../utils/logger";

@injectable()
export class UserService {
    private userRepository = AppDataSource.getRepository(User);

    /**
     * Requirement: Get All Users with Pagination
     */
    async getAllUsers(limit: number, offset: number) {
        logger.debug(`Fetching users with limit: ${limit}, offset: ${offset}`);

        // findAndCount is efficient: it gets the data AND the total count in one query
        const [users, total] = await this.userRepository.findAndCount({
            take: limit,
            skip: offset,
            relations: ["groups"], // Include group details for context
            order: { id: "ASC" }, // Deterministic ordering is crucial for pagination
        });

        return {
            data: users,
            meta: {
                total,
                limit,
                offset,
                page: Math.floor(offset / limit) + 1
            }
        };
    }

    /**
     * Bonus Requirement: Update Users Statuses
     * Constraint: Max 500 users, Atomic Transaction
     */
    async updateUsersBulk(updates: { id: number; status: UserStatus }[]) {
        if (updates.length > 500) {
            throw new Error("Batch limit exceeded: Cannot update more than 500 users at once.");
        }

        logger.info(`Starting bulk update for ${updates.length} users...`);

        // WRAPPED IN TRANSACTION: If one fails, they ALL fail.
        return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
            const updatePromises = updates.map(async ({ id, status }) => {
                // We use 'update' instead of 'save' for performance since we aren't changing relations
                const result = await transactionalEntityManager.update(User, id, { status });

                if (result.affected === 0) {
                    logger.warn(`User ID ${id} was not found during bulk update.`);
                }
            });

            await Promise.all(updatePromises);
            logger.info("Bulk update completed successfully.");
        });
    }
}