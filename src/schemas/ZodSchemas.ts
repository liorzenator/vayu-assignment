import { z } from 'zod';
import { UserStatus } from '../entity/User';

export const paginationSchema = z.object({
    query: z.object({
        limit: z.preprocess((val) => Number(val), z.number().int().positive().default(10)),
        offset: z.preprocess((val) => Number(val), z.number().int().nonnegative().default(0)),
    }),
});

export const bulkUpdateSchema = z.object({
    body: z.object({
        updates: z.array(
            z.object({
                id: z.number().int().positive(),
                status: z.enum(UserStatus),
            })
        ).min(1).max(500),
    }),
});

export const removeUserFromGroupSchema = z.object({
    params: z.object({
        groupId: z.preprocess((val) => Number(val), z.number().int().positive()),
        userId: z.preprocess((val) => Number(val), z.number().int().positive()),
    }),
});
