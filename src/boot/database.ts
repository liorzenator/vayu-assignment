import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Group } from "../entity/Group";
import { config as env } from "./env"; // Import your validated env

export const AppDataSource = new DataSource({
    type: "mysql",
    host: env.db.host,
    port: env.db.port, // This is now guaranteed to be a number
    username: env.db.username,
    password: env.db.password,
    database: env.db.schema,

    synchronize: env.nodeEnv !== 'production', // Safe check
    logging: env.nodeEnv === 'development',
    entities: [User, Group],
    subscribers: [],
    migrations: ["dist/src/migrations/*.js"],
});