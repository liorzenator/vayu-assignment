import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { Group } from "./Group";

export enum UserStatus {
    PENDING = "pending",
    ACTIVE = "active",
    BLOCKED = "blocked"
}

@Entity({ name: "users" }) // Matches SQL table name
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    // This column is missing in init.sql but required for the assignment.
    // TypeORM 'synchronize: true' will add this column automatically.
    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.PENDING
    })
    status: UserStatus;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    // --- Relationship ---

    @ManyToMany(() => Group, (group) => group.users)
    @JoinTable({
        name: "user_groups",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "group_id", referencedColumnName: "id" }
    })
    groups: Group[];
}