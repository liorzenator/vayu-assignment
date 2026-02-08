import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    CreateDateColumn
} from "typeorm";
import { User } from "./User";

export enum GroupStatus {
    EMPTY = "empty",
    NOT_EMPTY = "NotEmpty" // Updated to match the SQL insert value 'NotEmpty'
}

@Entity({ name: "groups" }) // Matches SQL table name
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        // distinct string type to match SQL VARCHAR(255)
        type: "varchar",
        length: 255,
        default: GroupStatus.NOT_EMPTY
    })
    status: string; // Changed to string to be safe with SQL's VARCHAR

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    // --- Relationship ---

    @ManyToMany(() => User, (user) => user.groups)
    users: User[];
}