import { Request, Response } from 'express';
import { logger } from '../utils/logger';

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
        logger.info(`Fetching all ${resourceName}...`);

        const limit = Number(req.query.limit);
        const offset = Number(req.query.offset);

        try {
            const result = await fetchMethod(limit, offset);
            logger.info(`Successfully fetched ${result.data.length} ${resourceName}`);
            res.json(result);
        } catch (error: any) {
            logger.error(`Error fetching ${resourceName}: ${error.message}`);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
