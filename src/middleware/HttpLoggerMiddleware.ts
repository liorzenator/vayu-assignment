import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/Logger';

export const httpLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
    const correlationId = (req as any).correlationId;
    const start = Date.now();

    // Intercept res.send to capture the response body
    const originalSend = res.send;
    let responseBody: any;

    res.send = function (body: any): Response {
        responseBody = body;
        return originalSend.call(this, body);
    };

    // Log when the request finishes
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;
        
        let parsedBody = responseBody;
        if (typeof responseBody === 'string') {
            try {
                parsedBody = JSON.parse(responseBody);
            } catch (e) {
                // Keep as string if not JSON
            }
        }
        
        logger.info(`${method} ${url} ${statusCode} - ${duration}ms`, { 
            correlationId, 
            isHttp: true,
            method,
            url,
            statusCode,
            duration,
            responseBody: parsedBody
        });
    });

    next();
};
