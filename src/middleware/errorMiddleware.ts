import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../utils/HttpException';
import { logger } from '../utils/logger';

export const errorMiddleware = (
    error: HttpException | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status = 500;
    let message = 'Internal Server Error';
    let details = null;

    if (error instanceof HttpException) {
        status = error.status;
        message = error.message;
        details = error.details;
    } else {
        // Log unexpected errors
        logger.error(`[Unhandled Error] ${error.message}`, error);
    }

    res.status(status).json({
        status,
        message,
        ...(details && { details }),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};
