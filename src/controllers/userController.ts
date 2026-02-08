import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { UserService } from '../services/UserService';
import { BaseController } from './baseController';

@injectable()
export class UserController extends BaseController {
    constructor(private userService: UserService) {
        super();
    }

    getAll = async (req: Request, res: Response) => {
        await this.handleGetAll(
            req,
            res,
            (limit, offset) => this.userService.getAllUsers(limit, offset),
            'users'
        );
    };

    updateUsersBulk = async (req: Request, res: Response) => {
        const { updates } = req.body;
        await this.userService.updateUsersBulk(updates);
        res.json({ message: 'Bulk update successful' });
    };
}