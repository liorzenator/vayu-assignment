import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/userController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();
const userController = container.resolve(UserController);

// Routes
router.get("/", asyncHandler(userController.getAll));
router.put("/bulk-update", asyncHandler(userController.updateUsersBulk));

export default router;