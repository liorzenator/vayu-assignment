import { cleanEnv, str, port, host, num } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

// Validate and clean the environment
const env = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
    PORT: port({ default: 8080 }),

    // Database Configuration
    DB_HOST: host(),
    DB_PORT: port(), // Ensures this is a valid port number (1-65535)
    DB_USERNAME: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    DB_ROOT_PASSWORD: str(), // For MySQL root password if needed

    // Example of a custom validator if needed
    // MAX_CONNECTIONS: num({ default: 10 }),
});

// Export a typed configuration object
export const config = {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    db: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        name: env.DB_NAME,
    },
};