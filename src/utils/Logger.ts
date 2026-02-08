import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// Define custom log format for development
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info', // 'debug' in dev, 'info' in prod
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), // Print stack trace for errors
        process.env.NODE_ENV === 'production' ? format.json() : format.simple()
    ),
    transports: [
        // 1. Log to console
        new transports.Console({
            format: combine(
                colorize(), // Add colors (Info=Green, Error=Red)
                logFormat
            ),
        }),
        // 2. Log errors to a specific file (Optional but professional)
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        // 3. Log everything to a combined file
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});