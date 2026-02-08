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
        if (validated.body) Object.assign(req.body, validated.body);
        if (validated.query) {
            try {
                (req as any).query = validated.query;
            } catch (e) {
                // If req.query is read-only, we must avoid direct assignment.
                // In some Express versions, it's a getter.
                // We'll try to define it if possible, or just Object.assign if it's an object.
                Object.assign(req.query, validated.query);
            }
        }
        if (validated.params) Object.assign(req.params, validated.params);

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            next(new HttpException(400, 'Validation failed', error.format()));
        } else {
            next(error);
        }
    }
};
