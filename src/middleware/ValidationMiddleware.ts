import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { HttpException } from '../utils/HttpException';

export const validate = (schema: ZodSchema) => 
    async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        }) as any;

        // Replace original with validated data (important for type safety and defaults)
        if (validated.body) {
            Object.assign(req.body, validated.body);
        }
        if (validated.query) {
            // req.query is often read-only in Express, so we must use Object.assign if it's an object
            // or define the property if it's missing (though it shouldn't be).
            // First clear existing query to ensure defaults from Zod are applied
            for (const key in req.query) {
                delete (req.query as any)[key];
            }
            Object.assign(req.query, validated.query);
        }
        if (validated.params) {
            Object.assign(req.params, validated.params);
        }

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            next(new HttpException(400, 'Validation failed', error.format()));
        } else {
            next(error);
        }
    }
};
