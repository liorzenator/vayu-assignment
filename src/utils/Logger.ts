import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// Filter for console: hide logs with { isHttp: true }
const filterHttp = format((info) => {
    return info.isHttp ? false : info;
});

// Filter for console: hide specific fields like responseBody
const consoleFormat = format((info) => {
    const { responseBody, ...rest } = info;
    return rest;
});

// Define custom log format for development
const logFormat = printf(({ level, message, timestamp, stack, correlationId }) => {
    return `${timestamp} [${level}]: ${stack || message} [${correlationId ? correlationId : ''}]`;
});

export const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info', // 'debug' in dev, 'info' in prod
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }), // Print stack trace for errors
    ),
    transports: [
        // 1. Log to console - Exclude responseBody
        new transports.Console({
            format: combine(
                consoleFormat(),
                colorize(), // Add colors (Info=Green, Error=Red)
                logFormat
            ),
        }),
        // 2. Structured JSON logging - ONLY JSON, INCLUDES HTTP logs
        new transports.File({ 
            filename: 'logs/application.log',
            format: format.json() 
        }),
        // 3. Log errors to a specific file (Optional but professional)
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        // 4. Log everything to a combined file (human readable) - EXCLUDES HTTP logs
        new transports.File({ 
            filename: 'logs/combined.log',
            format: combine(
                filterHttp(),
                logFormat
            )
        }),
    ],
});