import { injectable } from "tsyringe";
import { AppDataSource } from "../boot/database";
import { Group, GroupStatus } from "../entity/Group";
import { User } from "../entity/User";
import { logger } from "../utils/Logger";

@injectable()
export class GroupService {
    private groupRepository = AppDataSource.getRepository(Group);

    /**
     * Requirement: Remove user from group (Many-to-Many version)
     */
    async removeUserFromGroup(userId: number, groupId: number) {
        logger.debug(`Attempting to remove User ${userId} from Group ${groupId}`);

        return await AppDataSource.manager.transaction(async (manager : any) => {
            // 1. Check if the Group exists and load its users
            // We need the count of users to decide if it becomes 'empty' later
            const group = await manager.findOne(Group, {
                where: { id: groupId },
                relations: ["users"]
            });

            if (!group) throw new Error("Group not found");

            // 2. Check if the User is actually in this group
            const userIndex = group.users.findIndex((u: { id: number; })  => u.id === userId);
            if (userIndex === -1) {
                throw new Error("User is not in this group");
            }

            // 3. Remove the user using QueryBuilder (Directly deletes row from user_groups)
            // This is safer and more efficient for Many-to-Many than saving the whole entity
            await manager
                .createQueryBuilder()
                .relation(Group, "users")
                .of(groupId)
                .remove(userId);

            // 4. Update Group Status
            // We removed 1 user. If the previous length was 1, now it is 0.
            if (group.users.length === 1) {
                // It was 1, we removed 1, so now it's 0 (Empty)
                await manager.update(Group, groupId, {
                    status: GroupStatus.EMPTY
                });
                logger.debug(`Group ${groupId} is now empty.`);
            }

            return { message: "User removed successfully" };
        });
    }

    /**
     * Requirement: Get All Groups with Pagination
     */
    async getAllGroups(limit: number, offset: number) {
        logger.debug(`Fetching groups with limit: ${limit}, offset: ${offset}`);

        const [groups, total] = await this.groupRepository.findAndCount({
            take: limit,
            skip: offset,
            relations: ["users"], // Include users for context
            order: { id: "ASC" },
        });

        return {
            data: groups,
            meta: {
                total,
                limit,
                offset,
                page: Math.floor(offset / limit) + 1
            }
        };
    }
}