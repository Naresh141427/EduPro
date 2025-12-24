const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  userPasswordUpdateValidator,
} = require("../middlewares/validators/registerValidator");
const requirePermission = require("../middlewares/pbacMiddleware");

router.get("/me", authMiddleware, asyncHandler(userController.getMe));
router.patch("/me", authMiddleware, asyncHandler(userController.updateMe));
router.patch(
  "/update-password",
  authMiddleware,
  userPasswordUpdateValidator,
  asyncHandler(userController.updatePassword)
);
router.patch(
  "/deactivate",
  authMiddleware,
  requirePermission("user:deactivate"),
  userController.deactivateUser
);

module.exports = router;
