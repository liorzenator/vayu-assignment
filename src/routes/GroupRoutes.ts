import { Router } from "express";
import { container } from "tsyringe";
import { GroupController } from "../controllers/groupController";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validationMiddleware";
import { paginationSchema, removeUserFromGroupSchema } from "../schemas/zodSchemas";

const router = Router();
const groupController = container.resolve(GroupController);

// Routes
router.get("/", validate(paginationSchema), asyncHandler(groupController.getAll));
router.delete("/:groupId/users/:userId", validate(removeUserFromGroupSchema), asyncHandler(groupController.removeUserFromGroup));

export default router;
