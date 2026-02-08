import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserStatusColumn1707409200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD COLUMN `status` ENUM('pending', 'active', 'blocked') NOT NULL DEFAULT 'pending'").catch(() => {});
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `status`").catch(() => {});
    }
}
