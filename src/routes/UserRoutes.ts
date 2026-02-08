import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/userController";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validationMiddleware";
import { bulkUpdateSchema, paginationSchema } from "../schemas/zodSchemas";

const router = Router();
const userController = container.resolve(UserController);

// Routes
router.get("/", validate(paginationSchema), asyncHandler(userController.getAll));
router.put("/bulk-update", validate(bulkUpdateSchema), asyncHandler(userController.updateUsersBulk));

export default router;