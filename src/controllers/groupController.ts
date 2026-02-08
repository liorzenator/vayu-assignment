import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { GroupService } from '../services/GroupService';
import { logger } from '../utils/logger';
import { BaseController } from './BaseController';

@injectable()
export class GroupController extends BaseController {
    constructor(private groupService: GroupService) {
        super();
    }

    getAll = async (req: Request, res: Response) => {
        await this.handleGetAll(
            req,
            res,
            (limit, offset) => this.groupService.getAllGroups(limit, offset),
            'groups'
        );
    };

    removeUserFromGroup = async (req: Request, res: Response) => {
        const { userId, groupId } = req.params;
        logger.info(`Removing user ${userId} from group ${groupId}`);
        
        try {
            const result = await this.groupService.removeUserFromGroup(Number(userId), Number(groupId));
            res.json(result);
        } catch (error: any) {
            logger.error(`Error removing user from group: ${error.message}`);
            res.status(400).json({ error: error.message });
        }
    };
}
