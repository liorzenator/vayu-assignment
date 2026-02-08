import { Router } from "express";
import { container } from "tsyringe";
import { GroupController } from "../controllers/GroupController";
import { asyncHandler } from "../utils/AsyncHandler";
import { validate } from "../middleware/ValidationMiddleware";
import { paginationSchema, removeUserFromGroupSchema } from "../schemas/ZodSchemas";

const router = Router();
const groupController = container.resolve(GroupController);

// Routes
router.get("/", validate(paginationSchema), asyncHandler(groupController.getAll));
router.delete("/:groupId/users/:userId", validate(removeUserFromGroupSchema), asyncHandler(groupController.removeUserFromGroup));

export default router;
