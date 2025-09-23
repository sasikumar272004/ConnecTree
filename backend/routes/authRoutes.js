const express = require("express");
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Protected routes
router.post("/logout", protect, authController.logoutUser);
router.get("/profile", protect, authController.getProfile);

module.exports = router;