import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/UserController";
import { asyncHandler } from "../utils/AsyncHandler";
import { validate } from "../middleware/ValidationMiddleware";
import { bulkUpdateSchema, paginationSchema } from "../schemas/ZodSchemas";

const router = Router();
const userController = container.resolve(UserController);

// Routes
router.get("/", validate(paginationSchema), asyncHandler(userController.getAll));
router.put("/bulk-update", validate(bulkUpdateSchema), asyncHandler(userController.updateUsersBulk));

export default router;