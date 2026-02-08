import { Router } from "express";
import { container } from "tsyringe";
import { GroupController } from "../controllers/groupController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const groupController = container.resolve(GroupController);

// Routes
router.get("/", asyncHandler(groupController.getAll));
router.delete("/:groupId/users/:userId", asyncHandler(groupController.removeUserFromGroup));

export default router;
