import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/Logger';

export const httpLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
    const correlationId = (req as any).correlationId;
    const start = Date.now();

    // Log when the request finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;
        
        logger.info(`${method} ${url} ${statusCode} - ${duration}ms`, { correlationId });
    });

    next();
};
