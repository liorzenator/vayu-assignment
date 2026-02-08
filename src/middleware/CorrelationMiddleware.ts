import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

export const correlationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Generate 8 unique random characters (4 bytes = 8 hex chars)
    const correlationId = randomBytes(4).toString('hex');
    
    // Attach to request and response headers for traceability
    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('x-correlation-id', correlationId);
    
    // Also attach to the request object for easy access in other middlewares/controllers
    (req as any).correlationId = correlationId;
    
    next();
};
