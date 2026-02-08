import { Request, Response } from 'express';
import { logger } from '../utils/Logger';

export abstract class BaseController {
    /**
     * Generic getAll handler for paginated resources
     * @param req Express Request
     * @param res Express Response
     * @param fetchMethod Function that calls the service to get data and meta
     * @param resourceName Name of the resource for logging (e.g., 'users', 'groups')
     */
    protected async handleGetAll(
        req: Request,
        res: Response,
        fetchMethod: (limit: number, offset: number) => Promise<{ data: any[]; meta: any }>,
        resourceName: string
    ) {
        const correlationId = (req as any).correlationId;
        logger.info(`Fetching all ${resourceName}...`, { correlationId });

        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;

        try {
            const result = await fetchMethod(limit, offset);
            logger.info(`Successfully fetched ${result.data.length} ${resourceName}`, { correlationId });
            res.json(result);
        } catch (error: any) {
            logger.error(`Error fetching ${resourceName}: ${error.message}`, { correlationId, error });
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
